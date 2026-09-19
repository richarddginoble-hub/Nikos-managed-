// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function allowance(address owner, address spender) external view returns (uint256);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract NikosSubscription {
    enum Plan {
        CelebrityFullActivity,
        LiveBookings,
        MusicAndLyrics,
        BackstageVault,
        FanCommunities,
        AllAccess
    }

    struct Subscription {
        bool active;
        uint64 startedAt;
        uint64 lastRenewal;
        uint64 nextRenewal;
    }

    address public owner;
    address public treasury;
    address public immutable usdc;

    mapping(Plan => uint256) public planPrices;
    mapping(Plan => uint64) public planDurations;
    mapping(address => mapping(Plan => Subscription)) public subscriptions;

    event PlanUpdated(Plan indexed plan, uint256 price, uint64 duration);
    event Subscribed(address indexed user, Plan indexed plan, uint256 price, uint64 nextRenewal);
    event Renewed(address indexed user, Plan indexed plan, uint256 price, uint64 nextRenewal);
    event Canceled(address indexed user, Plan indexed plan);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _usdc, address _treasury) {
        require(_usdc != address(0), "USDC zero");
        require(_treasury != address(0), "Treasury zero");

        owner = msg.sender;
        treasury = _treasury;
        usdc = _usdc;

        // USDC has 6 decimals. Category prices are fixed USDC amounts.
        _setPlan(Plan.CelebrityFullActivity, 47000e6, 30 days);
        _setPlan(Plan.LiveBookings, 29000e6, 30 days);
        _setPlan(Plan.MusicAndLyrics, 3700e6, 365 days);
        _setPlan(Plan.BackstageVault, 7000e6, 30 days);
        _setPlan(Plan.FanCommunities, 2500e6, 30 days);
        _setPlan(Plan.AllAccess, 57000e6, 365 days);
    }

    function setPlan(Plan plan, uint256 price, uint64 duration) external onlyOwner {
        _setPlan(plan, price, duration);
    }

    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Treasury zero");
        treasury = _treasury;
    }

    function subscribe(Plan plan) external {
        uint256 price = planPrices[plan];
        uint64 duration = planDurations[plan];
        require(price > 0 && duration > 0, "Plan inactive");

        _charge(msg.sender, price);
        uint64 now64 = uint64(block.timestamp);
        uint64 next = now64 + duration;
        subscriptions[msg.sender][plan] = Subscription(true, now64, now64, next);
        emit Subscribed(msg.sender, plan, price, next);
    }

    // A keeper or the subscriber may call this after approving the required USDC allowance.
    function renew(address user, Plan plan) external {
        Subscription storage sub = subscriptions[user][plan];
        require(sub.active, "No active subscription");

        uint256 price = planPrices[plan];
        uint64 duration = planDurations[plan];
        require(price > 0 && duration > 0, "Plan inactive");
        _charge(user, price);

        uint64 now64 = uint64(block.timestamp);
        sub.lastRenewal = now64;
        sub.nextRenewal = now64 + duration;
        emit Renewed(user, plan, price, sub.nextRenewal);
    }

    function cancel(Plan plan) external {
        Subscription storage sub = subscriptions[msg.sender][plan];
        require(sub.active, "No active subscription");
        sub.active = false;
        sub.nextRenewal = 0;
        emit Canceled(msg.sender, plan);
    }

    function hasAccess(address user, Plan plan) external view returns (bool) {
        Subscription memory sub = subscriptions[user][plan];
        return sub.active && sub.nextRenewal > uint64(block.timestamp);
    }

    function _setPlan(Plan plan, uint256 price, uint64 duration) internal {
        require(price > 0 && duration > 0, "Invalid plan");
        planPrices[plan] = price;
        planDurations[plan] = duration;
        emit PlanUpdated(plan, price, duration);
    }

    function _charge(address user, uint256 amount) internal {
        require(IERC20(usdc).allowance(user, address(this)) >= amount, "Approve USDC first");
        require(IERC20(usdc).transferFrom(user, treasury, amount), "USDC transfer failed");
    }
}

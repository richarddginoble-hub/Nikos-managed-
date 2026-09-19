// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function allowance(address owner, address spender) external view returns (uint256);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
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
    uint64 public constant DAYS_IN_MONTH = 30 days;

    mapping(Plan => uint256) public planPrices;
    mapping(address => mapping(Plan => Subscription)) public subscriptions;

    event PlanPriceUpdated(Plan indexed plan, uint256 newPrice);
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

        // USDC uses 6 decimals. These are fixed monthly prices in USDC.
        planPrices[Plan.CelebrityFullActivity] = 47000e6;
        planPrices[Plan.LiveBookings] = 29000e6;
        planPrices[Plan.MusicAndLyrics] = 30e6;
        planPrices[Plan.BackstageVault] = 7000e6;
        planPrices[Plan.FanCommunities] = 2500e6;
        planPrices[Plan.AllAccess] = 57000e6;
    }

    function setPlanPrice(Plan plan, uint256 price) external onlyOwner {
        planPrices[plan] = price;
        emit PlanPriceUpdated(plan, price);
    }

    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Treasury zero");
        treasury = _treasury;
    }

    function subscribe(Plan plan) external {
        uint256 price = planPrices[plan];
        require(price > 0, "Plan inactive");
        _charge(msg.sender, price);

        uint64 now64 = uint64(block.timestamp);
        subscriptions[msg.sender][plan] = Subscription({
            active: true,
            startedAt: now64,
            lastRenewal: now64,
            nextRenewal: now64 + DAYS_IN_MONTH
        });

        emit Subscribed(msg.sender, plan, price, now64 + DAYS_IN_MONTH);
    }

    function renew(address user, Plan plan) external {
        Subscription storage sub = subscriptions[user][plan];
        require(sub.active, "No active subscription");

        uint256 price = planPrices[plan];
        require(price > 0, "Plan inactive");

        _charge(user, price);

        uint64 now64 = uint64(block.timestamp);
        sub.lastRenewal = now64;
        sub.nextRenewal = now64 + DAYS_IN_MONTH;

        emit Renewed(user, plan, price, now64 + DAYS_IN_MONTH);
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

    function _charge(address user, uint256 amount) internal {
        require(IERC20(usdc).allowance(user, address(this)) >= amount, "Approve USDC first");
        require(IERC20(usdc).transferFrom(user, treasury, amount), "USDC transfer failed");
    }
}

const CONFIG = {
    PIPEDRIVE: {
        API_TOKEN: "bc30c534bd70214b2558a752cb4e61b53678a7f1", 
        COMPANY_DOMAIN: "ansarulakov", 
        API_VERSION: "v1"
    },
    
    CUSTOM_FIELDS: {},
    
    FORM: {
        AUTO_SAVE_DRAFT: true,
        AUTO_SAVE_INTERVAL: 30000, 
        PHONE_FORMAT: "US",
        DATE_FORMAT: "YYYY-MM-DD"
    },
    
    ENDPOINTS: {
        DEALS: "/deals",
        PERSONS: "/persons",
        ORGANIZATIONS: "/organizations",
        ACTIVITIES: "/activities",
        USERS: "/users" 
    },
    
    DEFAULTS: {
        CURRENCY: "USD",
        DEAL_STATUS: "open",
        ACTIVITY_TYPE: "task"
    }
};

function getApiUrl(endpoint) {
    return `https://${CONFIG.PIPEDRIVE.COMPANY_DOMAIN}.pipedrive.com/api/${CONFIG.PIPEDRIVE.API_VERSION}${endpoint}?api_token=${CONFIG.PIPEDRIVE.API_TOKEN}`;
}

function isConfigured() {
    return CONFIG.PIPEDRIVE.API_TOKEN !== "YOUR_API_TOKEN_HERE" && 
           CONFIG.PIPEDRIVE.COMPANY_DOMAIN !== "YOUR_COMPANY_DOMAIN";
}




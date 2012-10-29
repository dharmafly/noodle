// Max time a single query and matching result is kept until it is expired
// Default: 1 hour

exports.cacheMaxTime   = 60 * 60 * 1000;


// Time until all cached items are removed all at once
// Default: 1 week
// Special: Setting this value to 0 will turn off this setting

// exports.cachePurgeTime = ((60 * 60 * 1000) * 24) * 7;
exports.cachePurgeTime = 5000;


// Maximum number of cache entries too be kept at one time
// Default: 124 entries
exports.cacheMaxSize   = 124;
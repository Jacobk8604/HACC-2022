const LocalStrategy = require('passport-local').Strategy
const UserDB = require('./user-db');

module.exports = class PassportInit extends UserDB {
    /**
     * Initializes the passport and tells it what strategy we're using and everything else like that
     * @param {import('passport')} passport Just import the passport module pls
     */
    constructor(passport) {
        super();

        passport.use(new LocalStrategy(
            { usernameField: 'email', passwordField: 'pass' },
            (email, pass, done) => this._authenticate(email, pass, done)
        ));
        passport.serializeUser(this._serialize);
        passport.deserializeUser(this._deserialize);
    }

    /**
     * This will make sure the person has a registered account in the dynamoDB
     * @param {String} email The user email
     * @param {String} pass The user password
     * @param {Function} done The passport done func
     * @returns {undefined} Nothin
     */
    async _authenticate(email, pass, done) {
        const user = await this.find(email, pass);

        if (!user.password) return done(null, false, { Message: "Incorrect email address or password" });
        done(null, user);
    }

    /**
     * Saves the person into a session
     * @param {Object} user Object that contains user login credentials
     * @param {?String} user.email The user email
     * @param {?String} user.password The user password
     * @param {Function} done The passport done func
     * @returns {undefined} Nothin
     */
    _serialize(user, done) {
        return done(null, user);
    }

    /**
     * Unsaves the person from a session
     * @param {Object} user Object that contains user login credentials
     * @param {?String} user.email The user email
     * @param {?String} user.password The user password
     * @param {Function} done The passport done func
     * @returns {undefined} Nothin
     */
    _deserialize(user, done) {
        return done(null, user);
    }
};
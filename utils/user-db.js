module.exports = class UserDB {
    /**
     * Loads the AWS DynamoDB
     */
    constructor() {
        const AWS = require('aws-sdk');

        AWS.config.update({
            region: process.env.AWS_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });

        this.dynamodb = new AWS.DynamoDB();
        this.TABLE_NAME = 'Users';
        this.PARTITION_KEY = 'email';
        this.SORT_KEY = 'password';
    }

    /**
     * Looks for a match in the DB with the same email and pass
     * @param {String} email The email of the user
     * @param {String} password The password of the user
     * @returns {Promise} AWS promised object
     */
    find(email, password) {
        return this._baseUpdate('get', email, password);
    }

    /**
     * Shoves a new user into the DB
     * @param {String} email The email of the user
     * @param {String} password The password of the user
     * @returns {Promise} AWS promised object
     */
    put(email, password) {
        return this._baseUpdate('put', email, password);
    }

    /**
     * Removes the user from the DB
     * @param {String} email The email of the user
     * @param {String} password The password of the user
     * @returns {Promise} AWS promised object
     */
    delete(email, password) {
        return this._baseUpdate('delete', email, password);
    }

    /**
     * The base method for putting and getting items accounts in the DB
     * @param {String} method Whether you want to insert or get users
     * @param {String} email The email of the user
     * @param {String} password The password of the user
     * @returns {Promise} AWS promised object
     */
    _baseUpdate(method, email, password) {
        const params = {
            TableName: this.TABLE_NAME,
            [method == 'put' ? 'Item' : 'Key']: {
                [this.PARTITION_KEY]: { S: email },
                [this.SORT_KEY]: { S: password },
            },
        };

        return this._parse(method, this.dynamodb[`${method}Item`](params).promise());
    }

    /**
     * Simplifies the aws object response
     * @param {Object} awsResponse Whatever aws responds with
     * @returns {?Object}  Better user object or just nothing
     */
    _parse(method, awsResponse) {
        return new Promise(async (resolve, reject) => {
            awsResponse = await awsResponse;

            const user = {
                email: awsResponse?.Item?.email?.S,
                password: awsResponse?.Item?.password?.S,
                id: awsResponse?.Item?.id?.S,
            };

            resolve(method == 'get' ? user : null);
        });
    }
};
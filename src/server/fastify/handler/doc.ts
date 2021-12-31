/**
 * @apiDefine InternalError
 * @apiErrorExample {json} Internal server error
 *     {
 *       "statusCode": 500,
 *       "error": "INTERNAL_SERVER_ERROR",
 *       "message": "GA:000 Action fail because unexpected error"
 *     }
 */

/**
 * @apiDefine ErrorFormat
 * @apiError (Error) {Number} statusCode Error's status code
 * @apiError (Error) {String} error Error's error name
 * @apiError (Error) {String} message Error's message
 */

/**
 * @apiDefine Authorization
 * @apiHeader {String} authorization User's token
 * @apiHeaderExample {json} Header-Example:
 * {
 *     "authorization": "eyJhbGciOkJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiMHg5MTQwZjc4NUZmODcxNzUzYTBjOTYxZkQwNzlCQ0IwNDAyMkJBZEU4IiwidGltZXN0YW1wIjoxNjQwOTIzNTAwLCJ0eXBlIjoiYXV0aCIsImV4cCI6MTY0MTAwOTUzOSwiaWF0IjoxNjQwOTIzMTM5fQ.Xct5dLcGTAmMW9ZTpYtbIml33vnFOPFnjtg3ojDUq4k"
 * }
 */

/**
 * @apiDefine TokenMissing
 * @apiErrorExample {json} Token missing
 *     {
 *       "statusCode": 401,
 *       "error": "Unauthorized",
 *       "message": "GA:101 Token Missing"
 *     }
 */

/**
 * @apiDefine TokenInvalid
 * @apiErrorExample {json} Token invalid
 *     {
 *       "statusCode": 401,
 *       "error": "Unauthorized",
 *       "message": "GA:100 Token Invalid"
 *     }
 */

/**
 * @apiDefine TokenExpired
 * @apiErrorExample {json} Token expired
 *     {
 *       "statusCode": 401,
 *       "error": "Unauthorized",
 *       "message": "GA:102 Token Expired"
 *     }
 */

/**
 * @apiDefine Token
 * @apiSuccess (Success) {String} token User's token used for next requests' authentication
 * @apiSuccessExample {json} Success-Response:
 *     {
 *       "token": "eyJhbGciOkJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiMHg5MTQwZjc4NUZmODcxNzUzYTBjOTYxZkQwNzlCQ0IwNDAyMkJBZEU4IiwidGltZXN0YW1wIjoxNjQwOTIzNTAwLCJ0eXBlIjoiYXV0aCIsImV4cCI6MTY0MTAwOTUzOSwiaWF0IjoxNjQwOTIzMTM5fQ.Xct5dLcGTAmMW9ZTpYtbIml33vnFOPFnjtg3ojDUq4k"
 *     }
 */

/**
 * @api {post} /log_in User login
 * @apiGroup User
 * @apiBody {String} sign_message User's sign message
 * @apiBody {String} address User's address
 * @apiBody {Number} timestamp User's timestamp
 * @apiParamExample {json} Request-Example:
 * {
 *     "sign_message": "0x3gb5f005b59ad40ca153c6937e7de27f5af7e28431b9baca1b0f2dda37b0fb0a1345c0af8846fec60255bee72bdede134a79c64dffcb27257f9a0475af200d791b",
 *     "address": "0x9140f785Ff871753a0c961fD079BCB04022BAdE8",
 *     "timestamp": 1640923500
 * }
 * @apiUse ErrorFormat
 * @apiErrorExample {json} Sign message invalid
 *     {
 *       "statusCode": 400,
 *       "error": "Bad Request",
 *       "message": "GA:200 Sign Message invalid"
 *     }
 * @apiErrorExample {json} Timestamp invalid
 *     {
 *       "statusCode": 400,
 *       "error": "Bad Request",
 *       "message": "GA:201 Timestamp invalid. Must in 60 seconds"
 *     }

 * @apiUse InternalError
 * @apiUse Token
 */

/**
 * @api {get} /user_info User info
 * @apiGroup User
 * @apiUse Authorization
 * @apiUse ErrorFormat
 * @apiUse TokenInvalid
 * @apiUse TokenMissing
 * @apiUse TokenExpired
 * @apiUse InternalError
 * @apiSuccess (Success) {Object|Null} result User's info
 * @apiSuccess (Success) {String} result._id User's id
 * @apiSuccess (Success) {String} result.address User's address
 * @apiSuccess (Success) {String} result.created_at User's record created time
 * @apiSuccess (Success) {String} result.last_login User's last login
 * @apiSuccessExample {json} Success-Response:
 *     {
 *       "result": {
 *           "_id": "61ce6fbd3896aefa8e05423b",
 *           "address": "0x9140f785Ff871753a0c961fD079BCB04022BAdE8",
 *           "create_at": "2021-12-31T02:49:33.412Z",
 *           "last_login": "2021-12-31T03:58:59.284Z"
 *       }
 *     }
 */

/**
 * @api {get} /refresh User refresh token
 * @apiGroup User
 * @apiUse Authorization
 * @apiUse ErrorFormat
 * @apiUse TokenInvalid
 * @apiUse TokenMissing
 * @apiUse TokenExpired
 * @apiUse InternalError
 * @apiUse Token
 */
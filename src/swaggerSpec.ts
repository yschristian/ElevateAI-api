import { schedule } from 'node-cron';
import { OpenAPIV3 } from 'openapi-types';

const swaggerSpec: OpenAPIV3.Document = {
    openapi: '3.0.0',
    info: {
        title: 'CyberAware Solution API',
        version: '1.0.0',
        description: 'API documentation For CyberAware Solution',
    },
    servers: [
        {
            url: 'http://localhost:4000/api',
        },
    ],
    paths: {
        '/auth/signup': {
            post: {
                summary: 'Sign up a new user',
                tags: ['Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UserSignup',
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'User created successfully',
                    },
                    '400': {
                        description: 'Bad request',
                    },
                },
            },
        },
        '/auth/signin': {
            post: {
                summary: 'Sign in a user',
                tags: ['Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UserSignin',
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'User signed in successfully',
                    },
                    '401': {
                        description: 'Unauthorized',
                    },
                },
            },
        },
        '/auth/verifyCode': {
            post: {
                summary: 'Verify code',
                tags: ['Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    userId: { type: 'string' },
                                    verificationCode: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Code verification successful',
                    },
                    '400': {
                        description: 'Bad request',
                    },
                },
            },
        },
        '/auth/forgotpassword': {
            post: {
                summary: 'Request password reset',
                tags: ['Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Password reset email sent',
                    },
                    '404': {
                        description: 'User not found',
                    },
                },
            },
        },
        '/auth/resetpassword/{token}': {
            post: {
                summary: 'Reset password',
                tags: ['Authentication'],
                parameters: [
                    {
                        in: 'path',
                        name: 'token',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    newPassword: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Password reset successful',
                    },
                    '400': {
                        description: 'Invalid or expired token',
                    },
                },
            },
        },
        '/auth/verify-email/{emailToken}': {
            get: {
                summary: 'Verify email',
                tags: ['Authentication'],
                parameters: [
                    {
                        in: 'path',
                        name: 'emailToken',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Email verified successfully',
                    },
                    '400': {
                        description: 'Invalid token',
                    },
                },
            },
        },
        '/auth/changepsw': {
            put: {
                summary: 'Change password',
                tags: ['Authentication'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    currentPassword: { type: 'string' },
                                    newPassword: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Password changed successfully',
                    },
                    '401': {
                        description: 'Unauthorized',
                    },
                },
            },
        },
        '/user/all': {
            get: {
                summary: 'Get all users',
                tags: ['User Management'],
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'List of all users',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/User',
                                    },
                                },
                            },
                        },
                    },
                    '401': {
                        description: 'Unauthorized',
                    },
                },
            },
        },
        '/user/profile': {
            get: {
                summary: 'Get user profile',
                tags: ['User Management'],
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'User profile',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/User',
                                },
                            },
                        },
                    },
                    '401': {
                        description: 'Unauthorized',
                    },
                },
            },
        },
        '/user/single/{id}': {
            get: {
                summary: 'Get a user by ID',
                tags: ['User Management'],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'User found',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/User',
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'User not found',
                    },
                },
            },
        },
        '/user/update/{id}': {
            put: {
                summary: 'Update user profile',
                tags: ['User Management'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/User',
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'user updated successfully',
                    },
                    '401': {
                        description: 'Unauthorized',
                    },
                },
            },
        },
        '/user/delete/{id}': {
            delete: {
                summary: 'Delete user',
                tags: ['User Management'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'User deleted successfully',
                    },
                    '401': {
                        description: 'Unauthorized',
                    },
                },
            },
        },
        '/course/create': {
            post: {
                summary: 'Create a new course',
                tags: ['Course Management'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                properties: {
                                    title: {
                                        type: 'string',
                                        description: 'Title of the course',
                                    },
                                    description: {
                                        type: 'string',
                                        description: 'Description of the course',
                                    },
                                    price: {
                                        type: 'string',
                                        description: 'Price of the course',
                                    },
                                    imageUrl: {
                                        type: 'string',
                                        format: 'binary',
                                        description: 'Image file for the course',
                                    },
                                },
                                required: ['title', 'description', 'price', 'imageUrl'],
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'Course created successfully',
                    },
                    '401': {
                        description: 'Unauthorized',
                    },
                },
            },
        },
        '/course/all': {
            get: {
                summary: 'All courses',
                tags: ['Course Management'],
                responses: {
                    '200': {
                        description: 'List of all courses',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Course',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/course/single/{id}': {
            get: {
                summary: 'Get a course by ID',
                tags: ['Course Management'],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Course found',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Course',
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Course not found',
                    },
                },
            },
        },
        '/course/update/{id}': {
            put: {
                summary: 'Update course',
                tags: ['Course Management'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                properties: {
                                    title: {
                                        type: 'string',
                                        description: 'Updated title of the course',
                                    },
                                    description: {
                                        type: 'string',
                                        description: 'Updated description of the course',
                                    },
                                    price: {
                                        type: 'string',
                                        description: 'Updated price of the course',
                                    },
                                    imageUrl: {
                                        type: 'string',
                                        format: 'binary',
                                        description: 'Updated image file for the course',
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Course updated successfully',
                    },
                    '401': {
                        description: 'Unauthorized',
                    },
                },
            },
        },
        '/course/delete/{id}': {
            delete: {
                summary: 'Delete course',
                tags: ['Course Management'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Course deleted successfully',
                    },
                    '401': {
                        description: 'Unauthorized',
                    },
                },
            },
        },
        '/lesson/create/{courseId}': {
            post: {
                summary: 'Create a new lesson',
                tags: ['Lesson Management'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                properties: {
                                    title: {
                                        type: 'string',
                                        description: 'Title of the lesson',
                                    },
                                    content: {
                                        type: 'string',
                                        description: 'Content of the lesson',
                                    },
                                    courseId: {
                                        type: 'string',
                                        description: 'ID of the course',
                                    },
                                    videoUrl: {
                                        type: 'string',
                                        description: 'Video URL for the lesson',
                                        format: 'binary', // For handling file uploads or media
                                    },
                                },
                                required: ['title', 'content', 'courseId',],
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'Lesson created successfully',
                    },
                    '401': {
                        description: 'Unauthorized',
                    },
                },
            },
        },
        '/lesson/all': {
            get: {
                summary: 'All lessons',
                tags: ['Lesson Management'],
                responses: {
                    '200': {
                        description: 'List of all lessons',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Lesson',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/lesson/single/{id}': {
            get: {
                summary: 'Get a lesson by ID',
                tags: ['Lesson Management'],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Lesson found',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Lesson',
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Lesson not found',
                    },
                },
            },
        },
        '/lesson/update/{id}': {
            put: {
                summary: 'Update lesson',
                tags: ['Lesson Management'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    title: {
                                        type: 'string',
                                        description: 'Updated title of the lesson',
                                    },
                                    content: {
                                        type: 'string',
                                        description: 'Updated content of the lesson',
                                    },
                                    courseId: {
                                        type: 'string',
                                        description: 'Updated ID of the course',
                                    },
                                    videoUrl: {
                                        type: 'string',
                                        description: 'Updated video URL for the lesson',
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Lesson updated successfully',
                    },
                    '401': {
                        description: 'Unauthorized',
                    },
                },
            },
        },
        '/lesson/delete/{id}': {
            delete: {
                summary: 'Delete lesson',
                tags: ['Lesson Management'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Lesson deleted successfully',
                    },
                    '401': {
                        description: 'Unauthorized',
                    },
                },
            },
        },
        '/lesson/byCourse/{courseId}': {
            get: {
                summary: 'Get lessons by course ID',
                tags: ['Lesson Management'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'courseId',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Lessons found',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Lesson',
                                    },
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'No lessons found',
                    },
                },
            },
        },
        '/sublesson/create/{lessonId}': {
            post: {
                summary: 'Create a new sub-lesson',
                tags: ['Sub-Lesson Management'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                properties: {
                                    title: {
                                        type: 'string',
                                        description: 'Title of the sub-lesson',
                                    },
                                    content: {
                                        type: 'string',
                                        description: 'Content of the sub-lesson',
                                    },
                                    lessonId: {
                                        type: 'string',
                                        description: 'ID of the lesson',
                                    },
                                    videoUrl: {
                                        type: 'string',
                                        description: 'Video URL for the sub-lesson',
                                        format: 'binary',
                                    },
                                    order: {
                                        type: 'string',
                                        description: 'Order of the sub-lesson',
                                    },
                                },
                                required: ['title', 'content', 'lessonId', 'order'],
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'Sub-lesson created successfully',
                    },
                    '401': {
                        description: 'Unauthorized',
                    },
                },
            },
        },
        '/sublesson/all': {
            get: {
                summary: 'All sub-lessons',
                tags: ['Sub-Lesson Management'],
                responses: {
                    '200': {
                        description: 'List of all sub-lessons',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/subLessons',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/sublesson/single/{id}': {
            get: {
                summary: 'Get a sub-lesson by ID',
                tags: ['Sub-Lesson Management'],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Sub-lesson found',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/subLessons',
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Sub-lesson not found',
                    },
                },
            },
        },
        '/sublesson/update/{id}': {
            put: {
                summary: 'Update sub-lesson',
                tags: ['Sub-Lesson Management'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                properties: {
                                    title: {
                                        type: 'string',
                                        description: 'Updated title of the sub-lesson',
                                    },
                                    content: {
                                        type: 'string',
                                        description: 'Updated content of the sub-lesson',
                                    },
                                    lessonId: {
                                        type: 'string',
                                        description: 'Updated ID of the lesson',
                                    },
                                    videoUrl: {
                                        type: 'string',
                                        description: 'Updated video URL for the sub-lesson',
                                    },
                                    order: {
                                        type: 'string',
                                        description: 'Updated order of the sub-lesson',
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Sub-lesson updated successfully',
                    },
                    '401': {
                        description: 'Unauthorized',
                    },
                },
            },
        },
        '/sublesson/delete/{id}': {
            delete: {
                summary: 'Delete sub-lesson',
                tags: ['Sub-Lesson Management'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Sub-lesson deleted successfully',
                    },
                    '401': {
                        description: 'Unauthorized',
                    },
                },
            },
        },
        '/quiz/create/:{lessonId}': {
            post: {
                summary: 'Create a new quiz',
                tags: ['Quiz Management'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    question: {
                                        type: 'string',
                                        description: 'Question for the quiz',
                                    },
                                    options: {
                                        type: 'string',
                                        description: 'Options for the quiz',
                                    },
                                    correctAnswer: {
                                        type: 'string',
                                        description: 'Correct answer for the quiz',
                                    },
                                },
                                required: ['question', 'options', 'correctAnswer'],
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'Quiz created successfully',
                    },
                    '401': {
                        description: 'Unauthorized',
                    },
                },
            },
        },
        '/quiz/all': {
            get: {
                summary: 'All quizzes',
                tags: ['Quiz Management'],
                responses: {
                    '200': {
                        description: 'List of all quizzes',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Quiz',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/quiz/single/{id}': {
            get: {
                summary: 'Get a quiz by ID',
                tags: ['Quiz Management'],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Quiz found',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Quiz',
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Quiz not found',
                    },
                },
            },
        },
        '/quiz/update/{id}': {
            put: {
                summary: 'Update quiz',
                tags: ['Quiz Management'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    question: {
                                        type: 'string',
                                        description: 'Updated question for the quiz',
                                    },
                                    options: {
                                        type: 'string',
                                        description: 'Updated options for the quiz',
                                    },
                                    correctAnswer: {
                                        type: 'string',
                                        description: 'Updated correct answer for the quiz',
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Quiz updated successfully',
                    },
                    '401': {
                        description: 'Unauthorized',
                    },
                },
            },
        },
        '/quiz/delete/{id}': {
            delete: {
                summary: 'Delete quiz',
                tags: ['Quiz Management'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Quiz deleted successfully',
                    },
                    '401': {
                        description: 'Unauthorized',
                    },
                },
            },
        },
        '/quiz/byLesson/{lessonId}': {
            get: {
                summary: 'Get quizzes by lesson ID',
                tags: ['Quiz Management'],
                parameters: [
                    {
                        in: 'path',
                        name: 'lessonId',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Quizzes found',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Quiz',
                                    },
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'No quizzes found',
                    },
                },
            },
        },
        "/quiz/submit/{lessonId}": {
            post: {
                summary: "Submit quiz answers",
                tags: ["Quiz Management"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "lessonId",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    answers: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                quizId: {
                                                    type: "string",
                                                    description: "ID of the quiz",
                                                },
                                                answer: {
                                                    type: "string",
                                                    description: "Answer to the quiz",
                                                },
                                            },
                                            required: ["quizId", "answer"],
                                        },
                                    },
                                },
                                required: ["answers"],
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Quiz submitted successfully",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            },
        },
        "/quiz/result/{lessonId}": {
            get: {
                summary: "Get user quiz results",
                tags: ["Quiz Management"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "lessonId",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "User quiz results",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/QuizResult",
                                    },
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            },
        },
        '/assessment/create/{courseId}': {
            post: {
                summary: 'Create a new assessment',
                tags: ['Assessment Management'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    question: {
                                        type: 'string',
                                        description: 'Question for the assessment',
                                    },
                                    options: {
                                        type: 'array',
                                        description: 'Options for the assessment',
                                        items: {
                                            type: 'string',
                                            description: 'Each option for the assessment',
                                        },
                                    },
                                    correctAnswer: {
                                        type: 'string',
                                        description: 'Correct answer for the assessment',
                                    },
                                },
                                required: ['question', 'options', 'correctAnswer'],
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'Assessment created successfully',
                    },
                    '401': {
                        description: 'Unauthorized',
                    },
                },
            },
        },
        "/assessment/submit/{courseId}": {
            post: {
                summary: "Submit assessment answers",
                tags: ["Assessment Management"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "courseId",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    answers: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                assessmentId: {
                                                    type: "string",
                                                    description: "ID of the assessment",
                                                },
                                                answer: {
                                                    type: "string",
                                                    description: "Answer to the assessment",
                                                },
                                            },
                                            required: ["assessmentId", "answer"],
                                        },
                                    },
                                },
                                required: ["answers"],
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Assessment submitted successfully",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            },
        },
        "/assessment/marks": {
            get: {
                summary: "Get user assessment marks",
                tags: ["Assessment Management"],
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "User assessment marks",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/AssessmentSubmission",
                                    },
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            },
        },
        "/assessment/course/{courseId}": {
            get: {
                summary: "Get assessments by course ID",
                tags: ["Assessment Management"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "courseId",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "Assessments found",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/Assessment",
                                    },
                                },
                            },
                        },
                    },
                    "404": {
                        description: "No assessments found",
                    },
                },
            },
        },
        "/assessment/all": {
            get: {
                summary: "Get all assessments",
                tags: ["Assessment Management"],
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "List of all assessments",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/Assessment",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/assessment/delete/{id}": {
            delete: {
                summary: "Delete assessment",
                tags: ["Assessment Management"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "Assessment deleted successfully",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            },
        },
        "/assessment/update/{id}": {
            put: {
                summary: "Update assessment",
                tags: ["Assessment Management"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    question: {
                                        type: "string",
                                        description: "Updated question for the assessment",
                                    },
                                    options: {
                                        type: "string",
                                        description: "Updated options for the assessment",
                                    },
                                    correctAnswer: {
                                        type: "string",
                                        description: "Updated correct answer for the assessment",
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Assessment updated successfully",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            },
        },
        "/assessment/single/{id}": {
            get: {
                summary: "Get an assessment by ID",
                tags: ["Assessment Management"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "Assessment found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Assessment",
                                },
                            },
                        },
                    },
                    "404": {
                        description: "Assessment not found",
                    },
                },
            },
        },
        "/assessment/fail": {
            get: {
                summary: "Get failed assessment",
                tags: ["Assessment Management"],
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "List of failed assessments",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/AssessmentSubmission",
                                    },
                                },
                            },
                        },
                    },
                },
            }
        },
        "/assessment/certified": {
            get: {
                summary: "Get certified assessment",
                tags: ["Assessment Management"],
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "List of certified assessments",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/AssessmentSubmission",
                                    },
                                },
                            },
                        },
                    },
                },
            }
        },
        "/assessment/failedByCourse/{courseId}": {
            get: {
                summary: "Get failed assessment by course",
                tags: ["Assessment Management"],
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "List of failed assessments by course",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/AssessmentSubmission",
                                    },
                                },
                            },
                        },
                    },
                },
            }
        },
        "/assessment/certifiedByCourse/{courseId}": {
            get: {
                summary: "Get certified assessment by course",
                tags: ["Assessment Management"],
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "List of certified assessments by course",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/AssessmentSubmission",
                                    },
                                },
                            },
                        },
                    },
                },
            }
        },
        "/assessment/submitted/{id}": {
            delete: {
                summary: "Delete submitted assessment",
                tags: ["Assessment Management"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "Assessment submission deleted successfully",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            },
        },
        "/assessment/allSubmitted": {
            get: {
                summary: "Get all submitted assessments",
                tags: ["Assessment Management"],
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "List of all submitted assessments",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/AssessmentSubmission",
                                    },
                                },
                            },
                        },
                    },
                },
            }
        },
        "/assessment/singleSubmitted/{id}": {
            get: {
                summary: "Get a submitted assessment by ID",
                tags: ["Assessment Management"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "Submitted assessment found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/AssessmentSubmission",
                                },
                            },
                        },
                    },
                    "404": {
                        description: "Submitted assessment not found",
                    },
                },
            },
        },
        "/pay/cashin/{courseId}": {
            post: {
                summary: "Cash in payment",
                tags: ["Payment Management"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "courseId",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "Payment successful",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            },
        },
        "/pay/webhook": {
            post: {
                summary: "Payment webhook",
                tags: ["Payment Management"],
                responses: {
                    "200": {
                        description: "Payment webhook",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            }
        },
        "/pay/byUser": {
            get: {
                summary: "Get payment by user",
                tags: ["Payment Management"],
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "Payment by user",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/Payment",
                                    },
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            }
        },
        "/pay/all": {
            get: {
                summary: "Get all payments",
                tags: ["Payment Management"],
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "All payments",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/Payment",
                                    },
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            }
        },
        "/pay/status/{id}": {
            get: {
                summary: "Get payment status",
                tags: ["Payment Management"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "Payment status",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            }
        },
        "/enroll/byCourse/{courseId}": {
            get: {
                summary: "Get enrolled users by course",
                tags: ["Enrollment Management"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "courseId",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "Enrolled users by course",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/User",
                                    },
                                },
                            },
                        },
                    },
                    "404": {
                        description: "No enrolled users found",
                    },
                },
            },
        },
        "/enroll/all": {
            get: {
                summary: "Get all enrolled users",
                tags: ["Enrollment Management"],
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "All enrolled users",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/User",
                                    },
                                },
                            },
                        },
                    },
                    "404": {
                        description: "No enrolled users found",
                    },
                },
            }
        },
        '/enroll/single/{id}': {
            get: {
                summary: "Get enrolled user by ID",
                tags: ["Enrollment Management"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "Enrolled user found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/User",
                                },
                            },
                        },
                    },
                    "404": {
                        description: "Enrolled user not found",
                    },
                },
            },
        },
        "/enroll/byUser": {
            get: {
                summary: "Get enrolled courses by user",
                tags: ["Enrollment Management"],
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "Enrolled courses by user",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/Course",
                                    },
                                },
                            },
                        },
                    },
                    "404": {
                        description: "No enrolled courses found",
                    },
                },
            },
        },
        "/enroll/delete/{id}": {
            delete: {
                summary: "Delete enrollment",
                tags: ["Enrollment Management"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "Enrollment deleted successfully",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            },
        },
        "/enroll/update/{id}": {
            put: {
                summary: "Update enrollment",
                tags: ["Enrollment Management"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    courseId: {
                                        type: "string",
                                        description: "Updated course ID",
                                    },
                                    userId: {
                                        type: "string",
                                        description: "Updated user ID",
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Enrollment updated successfully",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            },
        },
        "/enroll/number": {
            get: {
                summary: "Get number of enrollments",
                tags: ["Enrollment Management"],
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "Number of enrollments",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            },
        },
        "/progress/upsert": {
            post: {
                summary: "Upsert progress",
                tags: ["Progress Management"],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    courseId: {
                                        type: "string",
                                        description: "ID of the course",
                                    },
                                    lessonId: {
                                        type: "string",
                                        description: "ID of the lesson",
                                    },
                                    progress: {
                                        type: "number",
                                        description: "25,50,75,100",
                                    },

                                },
                                required: ["courseId", "progress", "lessonId"],
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Progress upserted successfully",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            },
        },
        "/progress/latest": {
            get: {
                summary: "Get latest progress",
                tags: ["Progress Management"],
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "Latest progress",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Progress",
                                },
                            },
                        },
                    },
                    "404": {
                        description: "No progress found",
                    },
                },
            },
        },
        "/progress/complete": {
            post: {
                summary: "Complete progress",
                tags: ["Progress Management"],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    courseId: {
                                        type: "string",
                                        description: "ID of the course",
                                    },
                                },
                                required: ["courseId"],
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Progress completed successfully",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            }
        },
        "/progress/course-progress": {
            get: {
                summary: "Get course progress",
                tags: ["Progress Management"],
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "Course progress",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/Progress",
                                    },
                                },
                            },
                        },
                    },
                    "404": {
                        description: "No progress found",
                    },
                },
            },
        },
        "/progress/overall/{courseId}": {
            get: {
                summary: "Get overall progress by course ID",
                tags: ["Progress Management"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "courseId",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "Overall progress",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        completed: {
                                            type: "number",
                                            description: "Number of completed lessons",
                                        },
                                        total: {
                                            type: "number",
                                            description: "Total number of lessons",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "404": {
                        description: "No progress found",
                    },
                },
            },
        },
        "/progress/{courseId}": {
            get: {
                summary: "Get progress by course ID",
                tags: ["Progress Management"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "courseId",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "Progress found",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/Progress",
                                    },
                                },
                            },
                        },
                    },
                    "404": {
                        description: "No progress found",
                    },
                },
            },
        },
        "/progress/next/{courseId}": {
            get: {
                summary: "Get next lesson by course ID",
                tags: ["Progress Management"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "courseId",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "Next lesson found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Lesson",
                                },
                            },
                        },
                    },
                    "404": {
                        description: "No next lesson found",
                    },
                },
            },
        },
        "/certificate/all": {
            get: {
                summary: "Get all certificates",
                tags: ["Certificate Management"],
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "All certificates",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/certificate",
                                    },
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            }
        },
        "/certificate/byId/{id}": {
            get: {
                summary: "Get certificate by ID",
                tags: ["Certificate Management"],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "Certificate found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/certificate",
                                },
                            },
                        },
                    },
                    "404": {
                        description: "Certificate not found",
                    },
                },
            }
        },
        "/certificate/byUser": {
            get: {
                summary: "Get certificate by user",
                tags: ["Certificate Management"],
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "Certificate by user",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/certificate",
                                    },
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            }
        },
        "/certificate/{id}": {
            delete: {
                summary: "Delete certificate",
                tags: ["Certificate Management"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "Certificate deleted successfully",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            }
        },
        "/certificate/download/{id}": {
            get: {
                summary: "Download certificate",
                tags: ["Certificate Management"],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "Certificate downloaded successfully",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            }
        },
        "/discussion/create/{lessonId}": {
            post: {
                summary: "Make comment and reply",
                tags: ["Like and Comments"],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    content: {
                                        type: "string",
                                        description: "ID of the course",
                                    },
                                    parentId: {
                                        type: "string",
                                        description: "ID for comments",
                                    },
                                },
                                required: ["content"],
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "comment added  successfully",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            },
        },
        "/discussion/byLesson/{lessonId}": {
            get: {
                summary: "Get discussion for lessons",
                tags: ["Like and Comments"],
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "discussion on lessons",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            }
        },
        "/discussion/all": {
            get: {
                summary: "Get discussion for lessons",
                tags: ["Like and Comments"],
                responses: {
                    "200": {
                        description: "all discussions",
                    },

                },
            }
        },
        "/discussion/delete/{id}": {
            delete: {
                summary: "Delete discussion",
                tags: ["Like and Comments"],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "discussion deleted successfully",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            }
        },
        "/like/lesson/{lessonId}": {
            post: {
                summary: "Like a lesson",
                tags: ["Like and Comments"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "lessonId",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "lesson liked successfully",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            }
        },
        "/like/discussion/{discussionId}": {
            post: {
                summary: "Like a discussion",
                tags: ["Like and Comments"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "discussionId",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "discussion liked successfully",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            }
        },
        "/like/removeDisc/{lessonId}": {
            delete: {
                summary: "Remove like from lesson",
                tags: ["Like and Comments"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "lessonId",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "lesson like removed successfully",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            }
        },
        "/like/removeLess/{discussionId}": {
            delete: {
                summary: "Remove like from discussion",
                tags: ["Like and Comments"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "discussionId",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "discussion like removed successfully",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            }
        },
        "/like/countdisc/{discussionId}": {
            get: {
                summary: "Count likes on a discussion",
                tags: ["Like and Comments"],
                parameters: [
                    {
                        in: "path",
                        name: "discussionId",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "likes on discussion",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            }
        },
        "/like/count/{lessonId}": {
            get: {
                summary: "Count likes on a lesson",
                tags: ["Like and Comments"],
                parameters: [
                    {
                        in: "path",
                        name: "lessonId",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "likes on lesson",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            }
        },
        "/schedule/create": {
            post: {
                summary: "Schedule events on the platform",
                tags: ["Schedule Management"],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    title: {
                                        type: "string",
                                        description: "Title of the event",
                                    },
                                    description: {
                                        type: "string",
                                        description: "Description of the event",
                                    },
                                    date: {
                                        type: "string",
                                        description: "Date of the event",
                                    },
                                    time: {
                                        type: "string",
                                        description: "Time of the event",
                                    },
                                    active: {
                                        type: "boolean",
                                        description: "Status of the event",
                                    },
                                },
                                required: ["title", "description", "date", "time", "active"],
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "scheduled upserted successfully",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            }
        },
        "/schedule/all": {
            get: {
                summary: "Get all scheduled events",
                tags: ["Schedule Management"],
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "All scheduled events",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/schedule",
                                    },
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            }
        },
        "schedule/delete/{id}": {
            delete: {
                summary: "Delete scheduled event",
                tags: ["Schedule Management"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "Scheduled event deleted successfully",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            }
        },
        "/schedule/update/{id}": {
            put: {
                summary: "Update scheduled event",
                tags: ["Schedule Management"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    title: {
                                        type: "string",
                                        description: "Updated title of the event",
                                    },
                                    description: {
                                        type: "string",
                                        description: "Updated description of the event",
                                    },
                                    date: {
                                        type: "string",
                                        description: "Updated date of the event",
                                    },
                                    time: {
                                        type: "string",
                                        description: "Updated time of the event",
                                    },
                                    active: {
                                        type: "boolean",
                                        description: "Updated status of the event",
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Scheduled event updated successfully",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            }
        },
        "schedule/byUser": {
            get: {
                summary: "Get scheduled events by user",
                tags: ["Schedule Management"],
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "Scheduled events by user",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/schedule",
                                    },
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            }
        },
        "/schedule/deactivate/{id}": {
            put: {
                summary: "Deactivate scheduled event",
                tags: ["Schedule Management"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "Scheduled event deactivated successfully",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            }
        },
        "/schedule/activate/{id}": {
            put: {
                summary: "Activate scheduled event",
                tags: ["Schedule Management"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "Scheduled event activated successfully",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                },
            }
        },
        "/schedule/{id}": {
            get: {
                summary: "Get scheduled event by ID",
                tags: ["Schedule Management"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "Scheduled event found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/schedule",
                                },
                            },
                        },
                    },
                    "404": {
                        description: "Scheduled event not found",
                    },
                },
            }
        }

    },
    components: {
        schemas: {
            UserSignup: {
                type: 'object',
                required: ['email', 'password', "firstName", "lastName"],
                properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' }
                },
            },
            UserSignin: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                },
            },
            User: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' }
                },
            },
            Course: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                    price: { type: 'string' },
                    imageUrl: { type: 'string' },
                    user: { type: 'object' }
                },
            },
            Lesson: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    title: { type: "string" },
                    content: { type: "string" },
                    courseId: { type: "object" },
                    videoUrl: { type: "string" },
                },
            },
            subLessons: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    title: { type: "string" },
                    content: { type: "string" },
                    lessonId: { type: "object" },
                    videoUrl: { type: "string" },
                    order: { type: "string" },
                },
            },
            Quiz: {
                properties: {
                    id: { type: "string" },
                    question: { type: "string" },
                    options: { type: "string" },
                    correctAnswer: { type: "string" }
                },
            },
            QuizResult: {
                properties: {
                    answers: {
                        type: 'array',
                        items: {
                            type: "object",
                            properties: {
                                quizId: {
                                    type: "string",
                                    description: "ID of the quiz",
                                },
                                answer: {
                                    type: "string",
                                    description: "Answer to the quiz",
                                },
                            },
                            required: ["quizId", "answer"],
                        },
                    }
                },
            },
            Assessment: {
                properties: {
                    id: { type: "string" },
                    question: { type: "string" },
                    options: {
                        type: 'array',
                        description: 'Options for the assessment',
                        items: {
                            type: 'string',
                            description: 'Each option for the assessment',
                        },
                    },
                    correctAnswer: { type: "string" }
                },
            },
            AssessmentSubmission: {
                properties: {
                    answers: {
                        type: 'array',
                        items: {
                            type: "object",
                            properties: {
                                assessmentId: {
                                    type: "string",
                                    description: "ID of the assessment",
                                },
                                answer: {
                                    type: "string",
                                    description: "Answer to the assessment",
                                },
                            },
                            required: ["assessmentId", "answer"],
                        },
                    }
                },
            },
            Payment: {
                properties: {
                    amount: { type: "number" },
                    phoneNumber: { type: "string" },
                }
            },
            Progress: {
                properties: {
                    courseId: { type: "string" },
                    lessonId: { type: "string" },
                    subLessonId: { type: "string" },
                    userId: { type: "string" },
                    completed: { type: "boolean" }
                }
            },
            certificate: {
                properties: {
                    id: { type: "string" },
                    userId: { type: "string" },
                    courseId: { type: "string" },
                    certificateUrl: { type: "string" },
                    certificateCode: { type: "string" },
                }
            },
            schedule: {
                properties: {
                    id: { type: "string", },
                    title: { type: "string", },
                    description: { type: "string", },
                    date: { type: "string", },
                    time: { type: "string", },
                    userId: { type: "string", },
                    active: { type: "boolean", },
                }
            }
        },
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },

    },
};

export default swaggerSpec;
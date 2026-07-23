const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My School API",
      version: "1.0.0",
      description: "توثيق احترافي لواجهة برمجة تطبيقات نظام (مدرستي).",
      contact: {
        name: "Backend Team",
      },
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "قم بإدخال الـ Token الخاص بك هنا (بدون كلمة Bearer)",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // المسارات التي تحتوي على تعليقات JSDoc
  apis: [
    "./Docs/SystemDocs/*.js",
    "./Docs/ManagementDocs/*.js",
    "./Docs/TeacherDocs/*.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

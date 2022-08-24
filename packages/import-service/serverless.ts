import type {AWS} from '@serverless/typescript';

import hello from '@functions/hello';
import importProductsFile from '@functions/importProductsFile';
import importFileParser from "@functions/importFileParser";

import {AWS_REGION, CORS_ORIGINS, S3_UPLOADS_BUCKET_NAME, SQS_NAME} from "./src/constants";

const serverlessConfiguration: AWS = {
    service: 'import-service',
    frameworkVersion: '3',
    plugins: [
        'serverless-auto-swagger',
        'serverless-esbuild',
        'serverless-offline',
    ],
    provider: {
        name: 'aws',
        runtime: 'nodejs16.x',
        region: AWS_REGION,
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        },
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: [
                    's3:PutObject',
                    's3:GetObject',
                    's3:DeleteObject',
                ],
                Resource: `arn:aws:s3:::${S3_UPLOADS_BUCKET_NAME}/*`,
            },
            {
                Effect: 'Allow',
                Action: [
                    'sqs:SendMessage',
                    'sqs:GetQueueUrl',
                ],
                Resource: `arn:aws:sqs:eu-west-1:320296196045:${SQS_NAME}`
            },
        ],
    },
    functions: {
        hello,
        importProductsFile,
        importFileParser,
    },
    resources: {
        Resources: {
            UploadsS3Bucket: {
                Type: 'AWS::S3::Bucket',
                Properties: {
                    BucketName: S3_UPLOADS_BUCKET_NAME,
                    AccessControl: 'Private',
                    PublicAccessBlockConfiguration: {
                        BlockPublicAcls: true,
                        BlockPublicPolicy: false,
                        IgnorePublicAcls: true,
                        RestrictPublicBuckets: true,
                    },
                    CorsConfiguration: {
                        CorsRules: [
                            {
                                AllowedHeaders: ["*"],
                                AllowedMethods: ["PUT"],
                                AllowedOrigins: CORS_ORIGINS,
                                MaxAge: 3000
                            }
                        ]
                    },
                    VersioningConfiguration: {
                        Status: 'Enabled'
                    }
                }
            },
        },
    },
    outputs: {
        UploadsS3BucketName: {
            Value: {
                Ref: 'UploadsS3Bucket',
            },
        }
    },
    package: {individually: true},
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node14',
            define: {'require.resolve': undefined},
            platform: 'node',
            concurrency: 10,
        },
        autoswagger: {
            title: 'Import Service',
            apiType: 'http',
            generateSwaggerOnDeploy: true,
            schemes: ['http', 'https'],
            basePath: '/dev'
        },
    },
};

module.exports = serverlessConfiguration;

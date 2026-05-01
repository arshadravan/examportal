pipeline {
    agent any
    parameters {
        string(name: 'SERVICE_NAME', defaultValue: '', description: 'Service name')
        string(name: 'VERSION', defaultValue: '', description: 'Version to deploy')
    }
    environment {
        DB_URL                  = credentials('DB_URL')
        DB_USERNAME             = credentials('DB_USERNAME')
        DB_PASSWORD             = credentials('DB_PASSWORD')
        JWT_SECRET              = credentials('JWT_SECRET')
        JWT_EXPIRATION          = credentials('JWT_EXPIRATION')
        KAFKA_BOOTSTRAP_SERVERS = credentials('KAFKA_BOOTSTRAP_SERVERS')
        MAIL_USERNAME           = credentials('MAIL_USERNAME')
        MAIL_PASSWORD           = credentials('MAIL_PASSWORD')
        REDIS_HOST              = credentials('REDIS_HOST')
    }
    stages {
        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${params.SERVICE_NAME.toLowerCase()}:${params.VERSION} ./${params.SERVICE_NAME}/${params.VERSION}/"
            }
        }
        stage('Run Container') {
            steps {
                sh "docker stop ${params.SERVICE_NAME.toLowerCase()} || true"
                sh "docker rm ${params.SERVICE_NAME.toLowerCase()} || true"
                script {
                    if (params.SERVICE_NAME.toLowerCase() == 'authservice') {
                        sh """
                            docker run -d --name ${params.SERVICE_NAME.toLowerCase()} \
                            --network ubuntu_default \
                            -p 8081:8081 \
                            -e SPRING_PROFILES_ACTIVE=prod \
                            -e SERVER_PORT=8081 \
                            -e DB_URL=\$DB_URL \
                            -e DB_USERNAME=\$DB_USERNAME \
                            -e DB_PASSWORD=\$DB_PASSWORD \
                            -e JWT_SECRET=\$JWT_SECRET \
                            -e JWT_EXPIRATION=\$JWT_EXPIRATION \
                            -e KAFKA_BOOTSTRAP_SERVERS=\$KAFKA_BOOTSTRAP_SERVERS \
                            -e REDIS_HOST=\$REDIS_HOST \
                            ${params.SERVICE_NAME.toLowerCase()}:${params.VERSION}
                        """
                    } else if (params.SERVICE_NAME.toLowerCase() == 'notification') {
                        sh """
                            docker run -d --name ${params.SERVICE_NAME.toLowerCase()} \
                            --network ubuntu_default \
                            -p 8082:8082 \
                            -e SPRING_PROFILES_ACTIVE=prod \
                            -e SERVER_PORT=8082 \
                            -e KAFKA_BOOTSTRAP_SERVERS=\$KAFKA_BOOTSTRAP_SERVERS \
                            -e MAIL_USERNAME=\$MAIL_USERNAME \
                            -e MAIL_PASSWORD=\$MAIL_PASSWORD \
                            ${params.SERVICE_NAME.toLowerCase()}:${params.VERSION}
                        """
                    } else {
                        sh """
                            docker run -d --name ${params.SERVICE_NAME.toLowerCase()} \
                            -p 3000:3000 \
                            ${params.SERVICE_NAME.toLowerCase()}:${params.VERSION}
                        """
                    }
                }
            }
        }
    }
}

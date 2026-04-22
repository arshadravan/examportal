pipeline {
    agent any
    parameters {
        string(name: 'SERVICE_NAME', defaultValue: '', description: 'Service name')
        string(name: 'VERSION', defaultValue: '', description: 'Version to deploy')
    }
    environment {
        DB_URL = credentials('DB_URL')
        DB_USERNAME = credentials('DB_USERNAME')
        DB_PASSWORD = credentials('DB_PASSWORD')
        JWT_SECRET = credentials('JWT_SECRET')
        JWT_EXPIRATION = credentials('JWT_EXPIRATION')
        KAFKA_BOOTSTRAP_SERVERS = credentials('KAFKA_BOOTSTRAP_SERVERS')
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
                            --network host \
                            -e SERVER_PORT=8081 \
                            -e DB_URL=\$DB_URL \
                            -e DB_USERNAME=\$DB_USERNAME \
                            -e DB_PASSWORD=\$DB_PASSWORD \
                            -e JWT_SECRET=\$JWT_SECRET \
                            -e JWT_EXPIRATION=\$JWT_EXPIRATION \
                            -e KAFKA_BOOTSTRAP_SERVERS=\$KAFKA_BOOTSTRAP_SERVERS \
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
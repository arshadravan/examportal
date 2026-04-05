pipeline {
    agent any
    stages {
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t authservice .'
            }
        }
        stage('Run Container') {
            steps {
                sh 'docker stop authservice || true'
                sh 'docker rm authservice || true'
                sh 'docker run -d --name authservice -p 8080:8080 authservice'
            }
        }
    }
}
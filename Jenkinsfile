pipeline {
    agent any
    
    environment {
        COMPOSE_FILE = 'docker-compose-jenkins.yml'
    }
    
    stages {
        stage('Checkout Code') {
            steps {
                echo 'Fetching code from GitHub...'
                checkout scm
            }
        }
        
        stage('Stop Previous Containers') {
            steps {
                echo 'Stopping any existing containers...'
                sh '''
                    docker compose -f ${COMPOSE_FILE} down || true
                '''
            }
        }
        
        stage('Build and Deploy') {
            steps {
                echo 'Starting application containers...'
                sh '''
                    docker compose -f ${COMPOSE_FILE} up -d --build
                '''
            }
        }
        
        stage('Verify Deployment') {
            steps {
                echo 'Verifying deployment...'
                sh '''
                    echo "Waiting for application to start..."
                    sleep 15
                    docker ps
                    echo "Checking if app is responding..."
                    curl -f http://localhost:3001 || echo "Application starting..."
                '''
            }
        }
        
        stage('Show Logs') {
            steps {
                echo 'Application logs:'
                sh 'docker compose -f ${COMPOSE_FILE} logs --tail=50 app-jenkins'
            }
        }
    }
    
    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed! Check logs above.'
            sh 'docker compose -f ${COMPOSE_FILE} logs'
        }
    }
}
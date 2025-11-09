pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'hotel-app'
        CONTAINER_NAME = 'hotel-app-container'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/ammar-tahir012/Mughal-s-Online-Hotel-Reservation.git'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}")
                }
            }
        }
        
        stage('Stop Previous Container') {
            steps {
                script {
                    sh 'docker stop ${CONTAINER_NAME} || true'
                    sh 'docker rm ${CONTAINER_NAME} || true'
                }
            }
        }
        
        stage('Run New Container') {
            steps {
                script {
                    docker.run(
                        "--name ${CONTAINER_NAME} -d -p 3001:3000 --env-file .env ${DOCKER_IMAGE}"
                    )
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                script {
                    sleep 10
                    sh 'curl -f http://localhost:3001 || exit 1'
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline completed - cleaning up workspace'
            cleanWs()
        }
        success {
            echo 'Deployment successful! Hotel app is running.'
        }
        failure {
            echo 'Deployment failed. Check logs above.'
        }
    }
}
  
           
  

# smart-spend

To run any specific container navigate to the desired service using <br />
`cd ./apps/:service-folder-name` and run: <br />
`docker build -t :container-name .` <br />
 after the container has been built run: <br />
`docker run -p port:port :container-name` <br />
for rabbit mq run: <br />
`docker run --rm -it --hostname my-rabbit -p 15672:15672 -p 5672:5672 rabbitmq:3-management` <br />

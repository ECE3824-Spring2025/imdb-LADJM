# Step 1: Use a lightweight web server
FROM nginx:alpine

# Step 2: Copy your website files into the nginx server
COPY . /usr/share/nginx/html

# Step 3: Expose port 80 (the default HTTP port)
EXPOSE 80
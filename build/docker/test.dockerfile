ARG BASE_IMAGE
FROM "$BASE_IMAGE"
COPY . .
RUN yarn run test:ci

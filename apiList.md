# DevTinder APIs

# authRouter
- POST /signup
- POST /login
- POST /logout

# profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

# connectionRequestRouter
- POST /request/send/:status/:toUserId
- POST /request/review/:status/:requestId

# userRouter
- GET user/connections
- GET user/requests
- GET user/feed

Status: ignored, interested, accepted, rejected
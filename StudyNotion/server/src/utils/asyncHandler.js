const asyncHandler = (requestedHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestedHandler(req, res, next)).catch((err) => next(err))
    }
}

export {asyncHandler}
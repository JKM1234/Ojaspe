const asyncHandler = (requestHandler)=>{
    return(req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>{
            console.error("Error caught in asyncHandler: ",err);

            res.status(err.statuscode || 500).json({
                success: false,
                message: err.message || "Internal server error",
                stack: ProcessingInstruction.env.NODE_ENV === "developement"? err.stack : undefined,
            });
        });
    };
};

export {asyncHandler}
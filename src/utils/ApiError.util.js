

class ApiError
{
    constructor(statusCode,message="SomeThing went Wrong",error=[],stack="")
    {
        this.message=message
        this.statusCode=statusCode
        this.error=error
        this.data=null
        this.success=false
        if(stack)
        {
            this.stack=stack
        }
        else
        {
            Error.captureStackTrace(this,this.constructor)
        }   
    }
}

export {ApiError}
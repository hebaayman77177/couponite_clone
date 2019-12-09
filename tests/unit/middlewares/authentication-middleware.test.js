// let authMiddleware=require('../../../middlewares/authentication-middleware')
// const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoibWUiLCJpYXQiOjE1NzUzNjM5OTZ9.F-mqnY16FGQ3VhwdkHVX7efOjzBMvQFHZ-xPO8n1Ha8"
// let server;
// describe('authentication middleware',()=>{
//     beforeEach(()=>{
//         server=require('../../../index')
//     })
//     afterEach(()=>{
//         server.close()
//     })

//     it('should populate req.user with payload and call next',()=>{
//     let  req={headers:{authorization:`bearer ${token}`}},
//          res={},
//          next=jest.fn();

//          authMiddleware(req,res,next)
//          expect(req.user).toBeDefined()
//          expect(next).toHaveBeenCalled()


//     })
// })
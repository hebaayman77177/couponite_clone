const request=require('supertest')
let server;

describe('authentication middleware',()=>{
    beforeEach(()=>{
         server=require('../../../index')
    })
    afterEach(()=>{
        server.close()
    })

    const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoibWUiLCJpYXQiOjE1NzUzNjM5OTZ9.F-mqnY16FGQ3VhwdkHVX7efOjzBMvQFHZ-xPO8n1Ha8"
    it('should return 401 if there is no authorization header',async()=>{
        const res=await request(server).get('/')
        expect(res.status).toBe(401) 
    })
    it('should return 401 if there is no token in auth header',async()=>{
        const res=await request(server).get('/').set('authorization','bearer')
        expect(res.status).toBe(401)
    })
    it('should return 401 if token is invalid',async()=>{
        const res=await request(server).get('/').set('authorization','bearer token')
        expect(res.status).toBe(401)
    })
    // it('should return 200 if token is verified truthy',async()=>{
    //     const res=await request(server).get('/').set('authorization',`bearer ${token}`)
    //     expect(res.status).toBe(200)
    // })//should be unit tested to make sure req.user is populated with payload and next is called

})










    // const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoibWUiLCJpYXQiOjE1NzUzNjM5OTZ9.F-mqnY16FGQ3VhwdkHVX7efOjzBMvQFHZ-xPO8n1Ha8"
        // const req={ "headers":{ "authorization":`bearer ${token}`}}
        // // const json=jest.fn().mockReturnValue({})
        // // const status=jest.fn().mockReturnValue({json})
        // // const res={status}
        // const res={}
        // const next=jest.fn()
        // middleware(req,res,next)
        // expect(next).toHaveBeenCalled()
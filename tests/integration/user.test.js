const request = require("supertest");
const mongoose = require("mongoose");
const { Token } = require("../../models/token");
const { User } = require("../../models/user");

let server;

describe("/api/user", async () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await User.remove();
    await Token.remove();
    server.close();
  });

  describe("/forgotPassword", async () => {
    it("should respond 400 if no user with the given email", async () => {
      let res = await request(server).post("/api/user/forgotPassword");
      expect(res.status).toBe(400);
      res = await request(server)
        .post("/api/user/forgotPassword")
        .send({ email: "he@k.c", password: "123456" });
      expect(res.status).toBe(400);
    });
    it("should respond 200 if the user email exist", async () => {
      const user = new User({
        email: "heba@jj.jj",
        password: "123456",
        phone: "01272677356",
        firstName: "heba",
        lastName: "ayman"
      });
      await user.save();
      let res = await request(server)
        .post("/api/user/forgotPassword")
        .send({ email: "heba@jj.jj", password: "123456" });
      expect(res.status).toBe(200);
    });
  });
  describe("/resetPassword", async () => {
    it("it should change the password to the one that in the token extra data if the token was found and belong to the user ", async () => {
      const user = new User({
        email: "heba@jj.jj",
        password: "123456",
        phone: "01272677356",
        firstName: "heba",
        lastName: "ayman"
      });
      await user.save();
      const generatedToken = Token.generateToken();
      const token = new Token({
        _userId: user._id,
        type: "password",
        extraData: "07775000",
        token: Token.hashToken(generatedToken)
      });
      await token.save();
      const res = await request(server).get(
        `/api/user/resetPassword/${generatedToken}`
      );
      const updatedUser = await User.findById(user._id);
      expect(res.status).toBe(200);
      expect(updatedUser.password).toBe(token.extraData);
    });
    it("if the type of the token change,it woudn't change the user password and return 400", async () => {
      const user = new User({
        email: "heba@jj.jj",
        password: "123456",
        phone: "01272677356",
        firstName: "heba",
        lastName: "ayman"
      });
      await user.save();
      const generatedToken = Token.generateToken();
      const token = new Token({
        _userId: user._id,
        type: "phone",
        extraData: "07775000",
        token: Token.hashToken(generatedToken)
      });
      await token.save();
      const res = await request(server).get(
        `/api/user/resetPassword/${generatedToken}`
      );
      const updatedUser = await User.findById(user._id);
      expect(res.status).toBe(400);
      expect(updatedUser.phone).toBe(user.phone);
    });
  });
  describe("/changePhone", async () => {
    it("should respond 401 if not logged in ", async () => {
      const res = await request(server)
        .post("/api/user/changePhone")
        .send({ phone: "01272677306" });
      expect(res.status).toBe(401);
    });
    it("should respond 200 if the user logged in ", async () => {
      const user = new User({ email: "heba@ff.ff" });
      await user.save();
      const token = user.generateToken();
      const res = await request(server)
        .post("/api/user/changePhone")
        .set("Authorization", `Bearer ${token}`)
        .send({ token, phone: "01272677858" });
      expect(res.status).toBe(200);
    });
  });
  describe("/resetPhone", async () => {
    it("it should change the password to the one that in the token extra data if the token was found and belong to the user", async () => {
      const user = new User({
        email: "heba@jj.jj",
        password: "123456",
        phone: "01272677356",
        firstName: "heba",
        lastName: "ayman"
      });
      await user.save();
      const authToken = user.generateToken();
      const generatedToken = Token.generateToken();
      const token = new Token({
        _userId: user._id,
        type: "phone",
        extraData: "01112223336",
        token: Token.hashToken(generatedToken)
      });
      await token.save();
      const res = await request(server)
        .post("/api/user/resetPhone")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ verificationToken: generatedToken });
      const updatedUser = await User.findById(user._id);
      expect(res.status).toBe(200);
      expect(updatedUser.phone).toBe(token.extraData);
    });
    it("if the type of the token change,it woudn't change the user phone and return 400", async () => {
      const user = new User({
        email: "heba@jj.jj",
        password: "123456",
        phone: "01272677356",
        firstName: "heba",
        lastName: "ayman"
      });
      await user.save();
      const authToken = user.generateToken();
      const generatedToken = Token.generateToken();
      const token = new Token({
        _userId: user._id,
        type: "login",
        extraData: "01112223336",
        token: Token.hashToken(generatedToken)
      });
      await token.save();
      const res = await request(server)
        .post("/api/user/resetPhone")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ verificationToken: generatedToken });
      const updatedUser = await User.findById(user._id);
      expect(res.status).toBe(400);
      expect(updatedUser.phone).toBe(user.phone);
    });
  });
  // describe("sigup controller", () => {
  //   let user = {
  //     firstName: "mahmoud",
  //     lastName: "nassif",
  //     email: "mahmoudnassifptp39@gmail.com",
  //     password: "123",
  //     phone: 10,
  //     role: "user",
  //     isVerified: "false",
  //     address: { country: "egypt", city: "cairo" }
  //   };
  //   it("should return 422 if req.body is invalid", async () => {
  //     const res = await request(server)
  //       .post("/api/user/signup")
  //       .send({});
  //     expect(res.status).toBe(422);
  //   });

  //   it("should return 400 if duplicate email is passed", async () => {
  //     await User.create(user);
  //     const res = await request(server)
  //       .post("/api/user/signup")
  //       .send(user);
  //     expect(res.status).toBe(400);
  //   });

  //   it("should populate the user db with user", async () => {
  //     await request(server)
  //       .post("/api/user/signup")
  //       .send(user);
  //     const res = await User.find({ email: user.email });
  //     expect(res.some(u => user.firstName === "mahmoud")).toBeTruthy();
  //   });

  //   it("should populate the token db with token", async () => {
  //     await request(server)
  //       .post("/api/user/signup")
  //       .send(user);
  //     const res = await Token.find({});
  //     expect(res.length).toBe(1);
  //   });
  //   //TODO:should make sure that send email method is called
  //   it("should return 200 if all is done", async () => {
  //     const res = await request(server)
  //       .post("/api/user/signup")
  //       .send(user);
  //     expect(res.status).toBe(200);
  //   });
  // });

  // describe("login controller", () => {
  //   let loginUser = {
  //     email: "mahmoudnassifptp39@gmail.com",
  //     password: "123",
  //     phone: 10
  //   };
  //   let user = {
  //     firstName: "mahmoud",
  //     lastName: "nassif",
  //     email: "mahmoudnassifptp39@gmail.com",
  //     password: "123",
  //     phone: 10,
  //     role: "user",
  //     isVerified: "false",
  //     address: { country: "egypt", city: "cairo" }
  //   };

  //   it("should return 400 if no email or password passed", async () => {
  //     const res = await request(server)
  //       .post("/api/user/login")
  //       .send({});
  //     expect(res.status).toBe(400);
  //   });

  //   it("should return 401 if no such user with email passed", async () => {
  //     const res = await request(server)
  //       .post("/api/user/login")
  //       .send({ email: "test@test", password: "123" });
  //     expect(res.status).toBe(400);
  //   });

  //   it("should return 400 if password is incorrect", async () => {
  //     await User.create(user);
  //     const res = await request(server)
  //       .post("/api/user/login")
  //       .send({ email: "mahmoudnassifptp39@gmail.com", password: "xxx" });
  //     expect(res.status).toBe(400);
  //   });
  //   // it('should return 200 if email and password are correct',async()=>{
  //   //     await User.create(user)
  //   //     const res=await request(server).post('/api/user/login').send(loginUser)
  //   //     expect(res.status).toBe(200)
  //   // })
  // });
});

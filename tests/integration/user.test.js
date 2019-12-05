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
});

const createServer = require('../utils/server');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const {
  clearCustomerCollection,
  initializeCustomerCollectionWithOneCustomer,
  initializeCustomerCollectionWithManyCustomers,
  getActivationLink,
  createCustomerWithActivationLink
} = require('../utils/customer');
const {
  getValidCustomerAccessToken,
  getExpiredCustomerAccessToken
} = require('../utils/token');
const CustomerData = require('../testsData/customer');

const app = createServer();
const request = require('supertest')(app);

describe('customer', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('POST /customer/registration', () => {
    afterEach(async () => {
      await clearCustomerCollection();
    });

    describe("given the fact that customer's collection is empty", () => {
      describe('given the input data is correct', () => {
        it('should return a 201 status and json with tokens and customerDto', async () => {
          const { body, statusCode } = await request
            .post(`/api/customer/registration`)
            .send(CustomerData.registrationCorrect1);

          expect(statusCode).toBe(201);
          expect(body.accessToken).toBeDefined();
          expect(body.refreshToken).toBeDefined();
          expect(body.customer).toBeDefined();
        });
      });

      describe('given the absence of login', () => {
        it('should return a 400 status and json with message', async () => {
          const { body, statusCode } = await request
            .post(`/api/customer/registration`)
            .send(CustomerData.registrationLoginAbsence);

          expect(statusCode).toBe(400);
          expect(body.message).toBe('invalid input');
          expect(
            body.errors.some(
              (error) => error.message === "must have required property 'login'"
            )
          ).toBe(true);
        });
      });

      describe('given the absence of password', () => {
        it('should return a 400 status and json with message', async () => {
          const { body, statusCode } = await request
            .post(`/api/customer/registration`)
            .send(CustomerData.registrationPasswordAbsence);

          expect(statusCode).toBe(400);
          expect(body.message).toBe('invalid input');
          expect(
            body.errors.some(
              (error) =>
                error.message === "must have required property 'password'"
            )
          ).toBe(true);
        });
      });

      describe('given the absence of name', () => {
        it('should return a 400 status and json with message', async () => {
          const { body, statusCode } = await request
            .post(`/api/customer/registration`)
            .send(CustomerData.registrationNameAbsence);

          expect(statusCode).toBe(400);
          expect(body.message).toBe('invalid input');
          expect(
            body.errors.some(
              (error) => error.message === "must have required property 'name'"
            )
          ).toBe(true);
        });
      });

      describe('given the absence of surname', () => {
        it('should return a 400 status and json with message', async () => {
          const { body, statusCode } = await request
            .post(`/api/customer/registration`)
            .send(CustomerData.registrationSurnameAbsence);

          expect(statusCode).toBe(400);
          expect(body.message).toBe('invalid input');
          expect(
            body.errors.some(
              (error) =>
                error.message === "must have required property 'surname'"
            )
          ).toBe(true);
        });
      });

      describe('given the absence of phone', () => {
        it('should return a 400 status and json with message', async () => {
          const { body, statusCode } = await request
            .post(`/api/customer/registration`)
            .send(CustomerData.registrationPhoneAbsence);

          expect(statusCode).toBe(400);
          expect(body.message).toBe('invalid input');
          expect(
            body.errors.some(
              (error) => error.message === "must have required property 'phone'"
            )
          ).toBe(true);
        });
      });

      describe('given the absence of email', () => {
        it('should return a 400 status and json with message', async () => {
          const { body, statusCode } = await request
            .post(`/api/customer/registration`)
            .send(CustomerData.registrationEmailAbsence);

          expect(statusCode).toBe(400);
          expect(body.message).toBe('invalid input');
          expect(
            body.errors.some(
              (error) => error.message === "must have required property 'email'"
            )
          ).toBe(true);
        });
      });
    });

    describe("given the fact that customer's collection has one customer", () => {
      beforeEach(async () => {
        await initializeCustomerCollectionWithOneCustomer();
      });

      describe('given the fact that customer with such login already exists', () => {
        it('should return a 409 status and json with message', async () => {
          const { body, statusCode } = await request
            .post(`/api/customer/registration`)
            .send(CustomerData.registrationCustomerWithSuchLoginExists);
          expect(statusCode).toBe(409);
          expect(body.errors.login.properties.type).toBe('unique');
        });
      });

      describe('given the fact that customer with such phone already exists', () => {
        it('should return a 409 status and json with message', async () => {
          const { body, statusCode } = await request
            .post(`/api/customer/registration`)
            .send(CustomerData.registrationCustomerWithSuchPhoneExists);
          expect(statusCode).toBe(409);
          expect(body.errors.phone.properties.type).toBe('unique');
        });
      });

      describe('given the fact that customer with such email already exists', () => {
        it('should return a 409 status and json with message', async () => {
          const { body, statusCode } = await request
            .post(`/api/customer/registration`)
            .send(CustomerData.registrationCustomerWithSuchEmailExists);
          expect(statusCode).toBe(409);
          expect(body.errors.email.properties.type).toBe('unique');
        });
      });
    });
  });

  describe('POST /customer/login', () => {
    describe("given the fact that customer's collection has one customer", () => {
      beforeAll(async () => {
        await initializeCustomerCollectionWithOneCustomer();
      });

      afterAll(async () => {
        await clearCustomerCollection();
      });

      describe('given the input data is correct', () => {
        it('should return a 200 status and json with tokens', async () => {
          const { body, statusCode } = await request
            .post(`/api/customer/login`)
            .send(CustomerData.loginCorrect1);

          expect(statusCode).toBe(200);
          expect(body.accessToken).toBeDefined();
          expect(body.refreshToken).toBeDefined();
        });
      });

      describe('given the absence of login', () => {
        it('should return a 400 status and message', async () => {
          const { body, statusCode } = await request
            .post(`/api/customer/login`)
            .send(CustomerData.loginLoginFieldAbsence);

          expect(statusCode).toBe(400);
          expect(body.message).toBe('invalid input');
          expect(
            body.errors.some(
              (error) => error.message === "must have required property 'login'"
            )
          ).toBe(true);
        });
      });

      describe('given the absence of password', () => {
        it('should return a 400 status and message', async () => {
          const { body, statusCode } = await request
            .post(`/api/customer/login`)
            .send(CustomerData.loginPasswordFieldAbsence);

          expect(statusCode).toBe(400);
          expect(body.message).toBe('invalid input');
          expect(
            body.errors.some(
              (error) =>
                error.message === "must have required property 'password'"
            )
          ).toBe(true);
        });
      });

      describe('given the incorrect login', () => {
        it('should return a 400 status and message', async () => {
          const { body, statusCode } = await request
            .post(`/api/customer/login`)
            .send(CustomerData.loginLoginIsIncorrect);

          expect(statusCode).toBe(400);
          expect(body.message).toBe('incorrect login');
        });
      });

      describe('given the incorrect password', () => {
        it('should return a 400 status and message', async () => {
          const { body, statusCode } = await request
            .post(`/api/customer/login`)
            .send(CustomerData.loginPasswordIsIncorrect);

          expect(statusCode).toBe(400);
          expect(body.message).toBe('incorrect password');
        });
      });
    });
  });

  describe('POST /customer/logout', () => {
    describe("given the fact that customer's collection has one customer", () => {
      let accessToken;
      beforeAll(async () => {
        await initializeCustomerCollectionWithOneCustomer();
        accessToken = getValidCustomerAccessToken(
          CustomerData.loginCorrect1,
          '15m'
        );
      });

      afterAll(async () => {
        await clearCustomerCollection();
      });

      describe('given the token is correct', () => {
        it('should return a 200 status and message', async () => {
          const { body, statusCode } = await request
            .post(`/api/customer/logout`)
            .set('Authorization', `Bearer ${accessToken}`);

          expect(statusCode).toBe(200);
          expect(body.message).toBe('customer logged out');
        });
      });

      describe('given the token was not provided', () => {
        it('should return a 401 status and message', async () => {
          const { body, statusCode } = await request.post(
            `/api/customer/logout`
          );

          expect(statusCode).toBe(401);
          expect(body.message).toBe('user is not authorized');
        });
      });

      describe('given the token is incorrect', () => {
        it('should return a 401 status and message', async () => {
          const { body, statusCode } = await request
            .post(`/api/customer/logout`)
            .set('Authorization', `Bearer ${CustomerData.incorrectToken}`);

          expect(statusCode).toBe(401);
          expect(body.message).toBe('user is not authorized');
        });
      });

      describe('given the token has expired', () => {
        it('should return a 401 status and message', async () => {
          const expiredToken = getExpiredCustomerAccessToken(
            CustomerData.loginCorrect1
          );

          const { body, statusCode } = await request
            .post(`/api/customer/logout`)
            .set('Authorization', `Bearer ${expiredToken}`);

          expect(statusCode).toBe(401);
          expect(body.message).toBe('user is not authorized');
        });
      });
    });
  });

  describe('DELETE /customer', () => {
    describe("given the fact that customer's collection has many customer", () => {
      beforeEach(async () => {
        await initializeCustomerCollectionWithManyCustomers();
      });

      afterEach(async () => {
        await clearCustomerCollection();
      });

      describe('given the fact that customer exists', () => {
        it('should return a 200 status and message', async () => {
          const accessToken = await getValidCustomerAccessToken(
            CustomerData.loginCorrect1,
            '15m'
          );

          const { body, statusCode } = await request
            .delete(`/api/customer`)
            .set('Authorization', `Bearer ${accessToken}`);

          expect(statusCode).toBe(200);
          expect(body.message).toBe('customer deleted');
        });
      });

      describe('given the fact that customer exists, but request was not authorized', () => {
        it('should return a 401 status and message', async () => {
          const { body, statusCode } = await request.delete(`/api/customer`);

          expect(statusCode).toBe(401);
          expect(body.message).toBe('user is not authorized');
        });
      });

      describe('given the fact that customer does not exists', () => {
        it('should return a 404 status and message', async () => {
          const accessToken = await getValidCustomerAccessToken(
            CustomerData.loginCorrect1,
            '15m'
          );
          await clearCustomerCollection();

          const { body, statusCode } = await request
            .delete(`/api/customer`)
            .set('Authorization', `Bearer ${accessToken}`);

          expect(statusCode).toBe(404);
          expect(body.message).toBe('customer was not found');
        });
      });
    });
  });

  describe('GET /activate/:link', () => {
    describe("given the fact that customer's collection has no customers", () => {
      afterEach(async () => {
        await clearCustomerCollection();
      });

      describe('given the activationLink is correct and customer exists', () => {
        it('should return a 302 status and message', async () => {
          const activationLink = getActivationLink();
          await createCustomerWithActivationLink(
            CustomerData.registrationCorrect1,
            activationLink
          );

          const { body, statusCode } = await request.get(
            `/api/customer/activate/${activationLink}`
          );

          expect(statusCode).toBe(302);
        });
      });

      describe('given the customer with such activationLink does not exist', () => {
        it('should return a 200 status and message', async () => {
          const activationLink = getActivationLink();
          await createCustomerWithActivationLink(
            CustomerData.registrationCorrect1,
            activationLink
          );
          const activationLinkOfNonExistingCustomer = getActivationLink();

          const { body, statusCode } = await request.get(
            `/api/customer/activate/${activationLinkOfNonExistingCustomer}`
          );

          expect(statusCode).toBe(400);
        });
      });
    });
  });
});

import { Request, Response, NextFunction } from "express";
import { auth } from "../src/config/firebase"; 
import { AuthenticationError} from "../src/api/v1/errors/errors";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

jest.mock("../src/config/firebase", () => ({
  auth: {
    verifyIdToken: jest.fn(),
  },
}));

jest.mock("../utils/errorUtils", () => ({
  getErrorMessage: jest.fn((err: Error) => err.message),
  getErrorCode: jest.fn((err: Error) => "TEST_ERROR_CODE"),
}));

describe("authenticate middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock<NextFunction>;

 
    beforeEach(() => {
        mockRequest = {
            headers: {},
        };
        mockResponse = {
            locals: {},
        };
        nextFunction = jest.fn();
    });

  it("should pass AuthenticationError to next() when no token is provided", async () => {
    await authenticate(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith(expect.any(AuthenticationError));
    const error = nextFunction.mock.calls[0][0];
    expect(error.message).toBe("Unauthorized: No token provided");
    expect(error.code).toBe("TOKEN_NOT_FOUND");
    expect(error.statusCode).toBe(401);
  });

  it("should pass AuthenticationError to next() when token verification fails", async () => {
    mockRequest.headers = { authorization: "Bearer invalid-token" };
    (auth.verifyIdToken as jest.Mock).mockRejectedValueOnce(new Error("Firebase token error"));

    await authenticate(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith(expect.any(AuthenticationError));
    const error = nextFunction.mock.calls[0][0];
    expect(error.message).toBe("Unauthorized: Firebase token error");
    expect(error.code).toBe("TEST_ERROR_CODE"); 
  });

  it("should call next() and set user data when token is valid", async () => {
    mockRequest.headers = { authorization: "Bearer valid-token" };
    (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
      uid: "test-uid",
      role: "admin",
    });

    await authenticate(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(auth.verifyIdToken).toHaveBeenCalledWith("valid-token");
    expect(mockResponse.locals).toEqual({
      uid: "test-uid",
      role: "admin",
    });

    expect(nextFunction).toHaveBeenCalledWith(); 
  });

  it("should handle malformed authorization header", async () => {
    mockRequest.headers = { authorization: "InvalidFormat" };

    await authenticate(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith(expect.any(AuthenticationError));
    const error = nextFunction.mock.calls[0][0];
    expect(error.message).toBe("Unauthorized: No token provided");
  });
});

function authenticate(arg0: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, arg1: Response<any, Record<string, any>>, nextFunction: jest.Mock<NextFunction, any, any>) {
    throw new Error("Function not implemented.");
}





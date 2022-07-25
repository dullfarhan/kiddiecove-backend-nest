import Response from './Response';
import Constant from './enums/Constant.enum';
import {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} from 'http-status-codes';
('use strict');
class Util {
  static getOkRequest(data, msg, res) {
    const response = new Response();
    response.setData(data);
    response.setMessage(msg);
    response.setStatus(Constant.SUCCESS);
    response.setStatusCode(StatusCodes.OK);
    return res.status(StatusCodes.OK).send(response);
  }
  static getSimpleOkRequest(msg, res) {
    const response = new Response();
    response.setMessage(msg);
    response.setStatus(Constant.SUCCESS);
    response.setStatusCode(StatusCodes.OK);
    return res.status(StatusCodes.OK).send(response);
  }
  static getBadRequest(msg, res) {
    const response = new Response();
    response.setMessage(msg);
    response.setStatus(Constant.FAIL);
    response.setStatusCode(StatusCodes.BAD_REQUEST);
    return res.status(StatusCodes.BAD_REQUEST).send(response);
  }
  static getNotContentRequest(msg, res) {
    const response = new Response();
    response.setMessage(msg);
    response.setStatus(Constant.SUCCESS);
    response.setStatusCode(StatusCodes.NO_CONTENT);
    return res.status(StatusCodes.NO_CONTENT).send(response);
  }
  static getUnauthorizedRequest(msg, res) {
    const response = new Response();
    response.setMessage(msg);
    response.setStatus(Constant.FAIL);
    response.setStatusCode(StatusCodes.UNAUTHORIZED);
    return res.status(StatusCodes.UNAUTHORIZED).send(response);
  }
  static getForbiddenRequest(msg, res) {
    const response = new Response();
    response.setMessage(msg);
    response.setStatus(Constant.FAIL);
    response.setStatusCode(StatusCodes.FORBIDDEN);
    return res.status(StatusCodes.FORBIDDEN).send(response);
  }

  static getISERequest(msg, res) {
    const response = new Response();
    response.setMessage(msg);
    response.setStatus(Constant.FAIL);
    response.setStatusCode(StatusCodes.INTERNAL_SERVER_ERROR);
    return res.status(StatusCodes.FORBIDDEN).send(response);
  }
  //todo Responses(used temporarily)
  static getBadResponse(msg) {
    const response = new Response();
    response.setMessage(msg);
    response.setStatus(Constant.FAIL);
    response.setStatusCode(StatusCodes.BAD_REQUEST);
    return response;
  }
  static getOkResponse(data, msg) {
    const response = new Response();
    response.setData(data);
    response.setMessage(msg);
    response.setStatus(Constant.SUCCESS);
    response.setStatusCode(StatusCodes.OK);
    return response;
  }
}
export default Util;

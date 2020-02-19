import {
  handleValidationErrors,
  handleCount,
  handleFindAll,
  handleModelOperation
} from './request';

jest.mock('express-validator', () => ({
  validationResult: jest.fn(req =>
    req
      ? {
          isEmpty: () => true
        }
      : {
          isEmpty: () => false,
          array: () => []
        }
  )
}));

describe('request utilities', () => {
  const error = new Error('Failed!');
  const count = 1;
  const data = [{ id: 1 }];
  const Model = {
    count: jest.fn().mockResolvedValue(count),
    findAll: jest.fn().mockResolvedValue(data),
    name: 'Model'
  };
  const FailModel = {
    count: jest.fn().mockRejectedValue(error),
    findAll: jest.fn().mockRejectedValue(error),
    destroy: jest.fn().mockRejectedValue(error),
    name: 'FailModel'
  };
  const emptyData = [];
  const EmptyModel = {
    findAll: jest.fn().mockResolvedValue(emptyData),
    name: 'EmptyModel'
  };
  const req = {};
  const res = {
    type: jest.fn(() => res),
    status: jest.fn(() => res),
    json: jest.fn(() => res),
    send: jest.fn(() => res),
    end: jest.fn(() => res)
  };
  const next = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleValidationErrors', () => {
    const middleware = handleValidationErrors();

    it('handles no validations', async () => {
      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('handles validations', async () => {
      await middleware(true, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('handles errors', async () => {
      await middleware(false, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors: [] });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('handleCount', () => {
    it('handles success', async () => {
      const middleware = handleCount(Model);

      await middleware(req, res);

      expect(res.type).toHaveBeenCalledWith('application/json');
      expect(res.json).toHaveBeenCalledWith({ result: count });
    });

    it('handles failure', async () => {
      const middleware = handleCount(FailModel);

      await middleware(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(error.message);
    });
  });

  describe('handleFindAll', () => {
    it('handles empty result with 204', async () => {
      const middleware = handleFindAll(EmptyModel);

      await middleware(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });

    it('handles populated result with 200', async () => {
      const middleware = handleFindAll(Model);

      await middleware(req, res);

      expect(res.type).toHaveBeenCalledWith('application/json');
      expect(res.json).toHaveBeenCalledWith(data);
    });

    it('handles failure', async () => {
      const middleware = handleFindAll(FailModel);

      await middleware(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(error.message);
    });
  });

  describe('handleModelOperation', () => {
    it('handles empty success', async () => {
      const middleware = handleModelOperation(EmptyModel, 'findAll');

      await middleware(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });

    it('handles populated success', async () => {
      const middleware = handleModelOperation(Model, 'findAll');

      await middleware(req, res);

      expect(res.type).toHaveBeenCalledWith('application/json');
      expect(res.json).toHaveBeenCalledWith(data);
    });

    it('handles failure', async () => {
      const middleware = handleModelOperation(FailModel, 'destroy');

      await middleware(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(error.message);
    });
  });
});

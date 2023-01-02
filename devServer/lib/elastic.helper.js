const { esclient } = require("../newconn");
const { elastic } = require("../elastic.index");
const { fetchWebinarSpecificData, listWebinarSpecificData, reportWebinarSpecificData } = require("./users.helper");
const bcrypt = require("bcrypt");

// Registration webinar
const registerWebinar = async (body, res) => {
  try {
    await esclient.index({
      index: elastic.WEBINAR,
      body,
    });
    return res.status(200).json({ message: "Registration successfully" });
  } catch (err) {
    return res.status(505).json({ error: "something went wrong!" });
  }
};

// edit webinar
const editWebinar = async (body, elasticId, res) => {
  let updatedAt = Date.now();
  updatedAt = new Date(updatedAt).toISOString();
  try {
    await esclient.updateByQuery({
      index: elastic.WEBINAR,
      body: {
        script: {
          inline:
            "ctx._source.title = params.title ; ctx._source.description = params.description; ctx._source.qa = params.qa; ctx._source.registartion = params.registration; ctx._source.record = params.record ; ctx._source.password = params.password  ; ctx._source.startDate = params.startDate; ctx._source.endDate = params.endDate; ctx._source.hostIds =  params.hostIds; ctx._source.updatedAt = params.updatedAt",
          lang: "painless",
          params: {
            title: body.title,
            description: body.description,
            qa: body.qa,
            record: body.record,
            registration: body.registration,
            password: body.password,
            startDate: body.startDate,
            endDate: body.endDate,
            hostIds: body.hostIds,
            updatedAt: updatedAt,
          },
        },
        query: {
          match: { _id: elasticId },
        },
      },
    });
    res.status(200).json({ message: "Document updated successfully!" });
  } catch (err) {
    res.status(470).json({ error: "Someting went wrong!" });
  }
};

// fetch_webinar
const fetchWebinar = async (createdBy, webinarId, res) => {
  try {
    const response = await esclient.search({
      index: elastic.WEBINAR,
      body: {
        query: {
          bool: { must: [{ match: { "createdBy.keyword": createdBy } }, { match: { _id: webinarId } }] },
        },
      },
    });
    const startDate = response.body.hits.hits[0]._source.startDate;
    if (startDate < Date.now()) {
      return res.status(200).json({ message: "Can't edit the webinar Details" });
    }
    const data = fetchWebinarSpecificData(response.body.hits.hits[0]);
    return res.status(200).json({ result: data });
  } catch (err) {
    return res.status(404).json({ error: "Invalid webinar Id!" });
  }
};

// cancel webinar
const cancelWebinar = async (createdBy, webinarId, isCancel, res) => {
  try {
    const response = await esclient.search({
      index: elastic.WEBINAR,
      body: {
        query: {
          bool: { must: [{ match: { "createdBy.keyword": createdBy } }, { match: { _id: webinarId } }] },
        },
      },
    });
    const startDate = response.body.hits.hits[0]._source.startDate;

    if (startDate < Date.now()) {
      return res.status(470).json({ message: "Unable to cancel the webinar, it was already held" });
    } else {
      await esclient.updateByQuery({
        index: elastic.WEBINAR,
        body: {
          script: {
            inline: "ctx._source.isCancel = params.isCancel",
            lang: "painless",
            params: {
              isCancel: isCancel,
            },
          },
          query: {
            match: { _id: webinarId },
          },
        },
      });
      return res.status(200).json({ message: "webinar cancel successfully" });
    }
  } catch (err) {
    return res.status(470).json({ error: "unable to fetch webinar" });
  }
};

// FeedBack

const feedBack = async (createdBy, feedbackType, message, email, res) => {
  // const reportDate = new Date().toISOString();
  const body = { createdBy, feedbackType, message, email, feedbackDate: new Date().toISOString() };
  try {
    await esclient.get({
      index: elastic.ACCOUNTS,
      id: createdBy,
    });
    await esclient.index({
      index: elastic.FEEDBACK,
      body,
    });
    return res.status(200).json({ message: "feedback added successfully" });
  } catch (err) {
    return res.status(470).json({ error: "You are not authorized user" });
  }
};

const webinarListing = async (createdBy, { type, search, size, from }, res) => {
  let result;
  let data;
  try {
    if (search && type == "upcoming" && (size || from)) {
      result = await esclient.search({
        index: elastic.WEBINAR,
        body: {
          from: from,
          size: size,
          query: {
            bool: {
              must: [{ match: { "createdBy.keyword": createdBy } }, { range: { startDate: { gte: Date.now() } } }],
              should: [{ match: { title: search } }],
              minimum_should_match: 1,
            },
          },
        },
      });
      data = listWebinarSpecificData(result.body.hits.hits);
      return res.status(200).json({ result: data });
    } else if (search && type == "previous" && (size || from)) {
      result = await esclient.search({
        index: elastic.WEBINAR,
        body: {
          from: from,
          size: size,
          query: {
            bool: {
              must: [{ match: { "createdBy.keyword": createdBy } }, { range: { startDate: { lt: Date.now() } } }],
              should: [{ match: { title: search } }],
              minimum_should_match: 1,
            },
          },
        },
      });
      data = listWebinarSpecificData(result.body.hits.hits);
      return res.status(200).json({ result: data });
    } else if (type == "previous" && (size || from)) {
      result = await esclient.search({
        index: elastic.WEBINAR,
        body: {
          from: from,
          size: size,
          query: {
            bool: {
              must: [{ match: { "createdBy.keyword": createdBy } }, { range: { startDate: { lte: Date.now() } } }],
            },
          },
        },
      });
      data = listWebinarSpecificData(result.body.hits.hits);
      return res.status(200).json({ result: data });
    } else if (type == "upcoming" && (size || from)) {
      result = await esclient.search({
        index: elastic.WEBINAR,
        body: {
          from: from,
          size: size,
          query: {
            bool: {
              must: [{ match: { "createdBy.keyword": createdBy } }, { range: { startDate: { gte: Date.now() } } }],
            },
          },
        },
      });
      data = listWebinarSpecificData(result.body.hits.hits);
      return res.status(200).json({ result: data });
    } else if (search && type == "all" && (size || from)) {
      result = await esclient.search({
        index: elastic.WEBINAR,
        body: {
          from: from,
          size: size,
          query: { bool: { must: [{ match: { "createdBy.keyword": createdBy } }, { match: { title: search } }] } },
          sort: [{ startDate: { order: "desc" } }],
        },
      });
      data = listWebinarSpecificData(result.body.hits.hits);
      return res.status(200).json({ result: data });
    } else {
      result = await esclient.search({
        index: elastic.WEBINAR,
        body: {
          from: from,
          size: size,
          sort: [{ startDate: { order: "desc" } }],
          query: { bool: { must: { match: { "createdBy.keyword": createdBy } } } },
        },
      });
      data = listWebinarSpecificData(result.body.hits.hits);
      return res.status(200).json({ result: data });
    }
  } catch (err) {
    res.status(470).json({ error: "Something went wrong" });
  }
};

const report = async (createdBy, { title, fromDate, toDate }, res) => {
  let result;
  try {
    if (title) {
      result = await esclient.search({
        index: elastic.WEBINAR,
        body: {
          query: {
            bool: {
              must: [{ match: { "createdBy.keyword": createdBy } }, { match: { title: title } }],
            },
          },
          sort: [{ startDate: { order: "desc" } }],
        },
      });
      result = result.body.hits.hits;
      if (fromDate && toDate) {
        const newResult = result.filter((data) => {
          const createdAt = new Date(data._source.createdAt).getTime();
          return createdAt >= fromDate && createdAt <= toDate;
        });
        const Data = reportWebinarSpecificData(newResult);
        return res.status(200).json({ result: Data });
      }

      // console.log(result);
      const Data = reportWebinarSpecificData(result);
      return res.status(200).json({ result: Data });
    }
  } catch (err) {
    res.status(470).json({ error: "something went wrong" });
  }
};

// auth function

const insertUser = async (body) => {
  try {
    const query = { match: { "email.keyword": body.email } };
    const isEmailAlreadyExist = await esclient.search({
      index: elastic.ACCOUNTS,
      body: {
        query,
      },
    });
    if (isEmailAlreadyExist.body.hits.hits.length > 0) {
      return { code: 444, message: "email already exist, please choose another one" };
    }
    const newDoc = { ...body, createdAt: new Date().toISOString(), lastUpdatedAt: new Date().toISOString() };
    await esclient.index({
      index: elastic.ACCOUNTS,
      body: newDoc,
    });
    return { code: 200, message: "User inserted successfully" };
  } catch (err) {
    return { message: "something went wrong" };
  }
};

const findUser = async (param) => {
  try {
    const query = { match: { "email.keyword": param.email } };
    const isRecordExist = await esclient.search({
      index: elastic.ACCOUNTS,
      body: {
        query,
      },
    });
    if (isRecordExist.body.hits.hits.length > 0) {
      const encryptPassword = isRecordExist.body.hits.hits[0]._source.encryptPassword;
      const isPasswordMatched = await bcrypt.compare(param.password, encryptPassword);
      if (!isPasswordMatched) {
        return { code: 410, message: "Invalid password" };
      }
      return { code: 200, message: "successfully login" };
    }
    return { code: 410, message: "Invalid email and password" };
  } catch (error) {
    return { code: 510, message: error };
  }
};

module.exports = {
  registerWebinar,
  editWebinar,
  fetchWebinar,
  cancelWebinar,
  feedBack,
  webinarListing,
  report,
  insertUser,
  findUser,
};

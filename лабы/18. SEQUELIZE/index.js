const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const sequelize = require('./db/db');
var http = require("http");
var url = require("url");
var fs = require("fs");

const { Faculty, Pulpit, Teacher, Subject, Auditorium_type, Auditorium } =
  require("./Models").ORM(sequelize);



let http_handler = async (req, res) => {
  path = url.parse(req.url).pathname;
  switch (req.method) {
    case "GET":
    if (url.parse(req.url).pathname === "/") {
      let html = fs.readFileSync("./14-01.html");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    } else if (url.parse(req.url).pathname === "/api/faculties") {
      Faculty.findAll().then((faculties) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(faculties));
      });
    }else if (url.parse(req.url).pathname === "/api/teachers") {
      Teacher.findAll().then((faculties) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(faculties));
      });
    } else if (url.parse(req.url).pathname === "/api/pulpits") {
      Pulpit.findAll().then((pulpits) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(pulpits));
      });
    } else if (url.parse(req.url).pathname === "/api/subjects") {
      Subject.findAll().then((subjects) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(subjects));
      });
    } else if (url.parse(req.url).pathname === "/api/auditoriumstypes") {
      Auditorium_type.findAll().then((auditorium_types) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(auditorium_types));
      });
    } else if (url.parse(req.url).pathname === "/api/auditoriums") {
      Auditorium.findAll().then((auditoriums) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(auditoriums));
      });
    } else if (url.parse(req.url).pathname === "/api/auditoriumsgt60") {
      const scope = Auditorium.scope("auditoriumsgt60");
      scope.findAll().then((auditoriums) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(auditoriums));
      });
    } else if (url.parse(req.url).pathname === "/api/transact") {
      const t =await sequelize.transaction();
      Auditorium.update(
        { auditorium_capacity: 0 },
        {
          where: {
            auditorium_capacity: 90,
          },
          transaction: t,
        }
      ).then(()=>{      
        Auditorium.findAll({transaction: t,}).then((auditoriums) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(auditoriums));
     
      })} ).catch((err)=>{
      });


      setTimeout(async () => {
        await t.rollback();
      }, 10000);
    }
    else if (/api\/faculties\/\w+\/pulpits/.test(path)){
      let fac = path.split('/')[3];
      Pulpit.findOne({ where: { faculty:  fac} }).then((pulpits) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(pulpits));
      });
    }
    else if (/api\/faculties\/\w+\/teachers/.test(path)){
      let fac = path.split('/')[3];
      Pulpit.findOne({ where: { faculty:  fac} }).then((pulpits) => {
        Teacher.findOne({ where: { pulpit:  pulpits.pulpit} }).then((teach) => {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(teach));
        });
      });
    }
    //=------------------------------------------------------------------------------------------------------------------------------
  break; 
  case "POST":
    if (url.parse(req.url).pathname === "/api/faculties") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        let o = JSON.parse(body);

        Faculty.create({ faculty: o.faculty, faculty_name: o.faculty_name })
          .then((task) => {
            console.log(task);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              `{"Faculty":"${o.faculty}","Faculty_name":"${o.faculty_name}"}`
            );
          })
          .catch((err) => {
            console.log(err);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              `{"error":"1","messsage":"structural failure"}`
            );
          });
      });
    } else if (url.parse(req.url).pathname === "/api/pulpits") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        let o = JSON.parse(body);
        Pulpit.create({
          pulpit: o.pulpit,
          pulpit_name: o.pulpit_name,
          faculty: o.faculty,
        })
          .then((task) => {
            console.log(task);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              `{"Pulpit":"${o.pulpit}","Pulpit_name":"${o.pulpit_name}","Faculty":"${o.faculty}"}`
            );
          })
          .catch((err) => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              `{"error":"1","messsage":"structural failure"}`
            );
            console.log(err);
          });
      });
    } else if (url.parse(req.url).pathname === "/api/subjects") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", async () => {
        let o = JSON.parse(body);
        Subject.create({
          subject: o.subject,
          subject_name: o.subject_name,
          pulpit: o.pulpit,
        })
          .then((task) => {
            console.log(task);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              `{"Subject":"${o.subject}","Subject_name":"${o.subject_name}","Pulpit":"${o.pulpit}"}`
            );
          })
          .catch((err) => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              `{"error":"1","messsage":"structural failure"}`
            );
            console.log(err);
          });
      });
    } else if (url.parse(req.url).pathname === "/api/auditoriumstypes") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        let o = JSON.parse(body);
        Auditorium_type.create({
          auditorium_type: o.auditorium_type,
          auditorium_typename: o.auditorium_typename,
        })
          .then((task) => {
            console.log(task);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              `{"Audtiorium_type":"${o.auditorium_type}","Auditorium_typename":"${o.auditorium_typename}"}`
            );
          })
          .catch((err) => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              `{"error":"1","messsage":"structural failure "}`
            );
            console.log(err);
          });
      });
    } else if (url.parse(req.url).pathname === "/api/auditoriums") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        let o = JSON.parse(body);
        Auditorium.create({
          auditorium: o.auditorium,
          auditorium_name: o.auditorium_name,
          auditorium_capacity: o.auditorium_capacity,
          auditorium_type: o.auditorium_type,
        })
          .then((task) => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              `{"Auditorium":"${o.auditorium}","Auditorium_name":"${o.auditorium_name}","Auditorium_capacity":${o.auditorium_capacity}, "Auditorium_type":${o.auditorium_type}}`
            );
            console.log(task);
          })
          .catch((err) => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              `{"error":"1","messsage":" structural failure }`
            );
            console.log(err);
          });
      });
    }
    break;
  case "PUT":
    if (url.parse(req.url).pathname === "/api/faculties") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        let o = JSON.parse(body);
        Faculty.update(
          { faculty_name: o.faculty_name },
          { where: { faculty: o.faculty } }
        )
          .then((task) => {
            console.log(task);
            if (task > 0) {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                `{"Faculty":"${o.faculty}","Faculty_name":"${o.faculty_name}"}`
              );
            } else {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                `{"error":1,"message":"no faculty"}`
              );
            }
          })
          .catch((err) => {
            console.log(err);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(err));
          });
      });
    } else if (url.parse(req.url).pathname === "/api/pulpits") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        let o = JSON.parse(body);
        Pulpit.update(
          { pulpit_name: o.pulpit_name, faculty: o.faculty },
          { where: { pulpit: o.pulpit } }
        )
          .then((task) => {
            console.log(task);
            if (task > 0) {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                `{"Pulpit":"${o.pulpit}","Pulpit_name":"${o.pulpit_name}","Faculty":"${o.faculty}"}`
              );
            } else {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                `{"error":1,"message":"no pulpit"}`
              );
            }
          })
          .catch((err) => {
            console.log(err);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(err));
          });
      });
    } else if (url.parse(req.url).pathname === "/api/subjects") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        let o = JSON.parse(body);
        Subject.update(
          { subject_name: o.subject_name, pulpit: o.pulpit },
          { where: { subject: o.subject } }
        )
          .then((task) => {
            console.log(task);
            if (task > 0) {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                `{"Subject":"${o.subject}","Subject_name":"${o.subject_name}","Pulpit":"${o.pulpit}"}`
              );
            } else {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                `{"error":1,"message":"no subject"}`
              );
            }
          })
          .catch((err) => {
            console.log(err);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(err));
          });
      });
    } else if (url.parse(req.url).pathname === "/api/auditoriumstypes") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        let o = JSON.parse(body);
        Auditorium_type.update(
          { auditorium_typename: o.auditorium_typename },
          { where: { auditorium_type: o.auditorium_type } }
        )
          .then((task) => {
            console.log(task);
            if (task > 0) {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                `{"Audtiorium_type":"${o.auditorium_type}","Auditorium_typename":"${o.auditorium_typename}"}`
              );
            } else {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                `{"error":1,"message":"no aud type"}`
              );
            }
          })
          .catch((err) => {
            console.log(err);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(err));
          });
      });
    } else if (url.parse(req.url).pathname === "/api/auditoriums") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        let o = JSON.parse(body);
        Auditorium.update(
          {
            auditorium_name: o.auditorium_name,
            auditorium_capacity: o.auditorium_capacity,
            auditorium_type: o.auditorium_type,
          },
          { where: { auditorium: o.auditorium } }
        )
          .then((task) => {
            console.log(task);
            if (task > 0) {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                `{"Auditorium":"${o.auditorium}","Auditorium_name":"${o.auditorium_name}","Auditorium_capacity":${o.auditorium_capacity}, "Auditorium_type":${o.auditorium_type}}`
              );
            } else {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                `{"error":1,"message":"no aud"}`
              );
            }
          })
          .catch((err) => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(err));
            console.log(err);
          });
      });
    }
    break;
  case "DELETE":
    console.log(url.parse(req.url).pathname);
    if (url.parse(req.url).pathname.search("/api/faculties/[A-я]+") != -1) {
      let p = url.parse(req.url, true);
      let r = decodeURI(p.pathname).split("/");
      let o = r[3];
      sequelize
        .query(
          "SELECT FACULTY,FACULTY_NAME FROM FACULTY where FACULTY='" + o + "'"
        )
        .then((result) => {
          Faculty.destroy({ where: { faculty: o } })
            .then((task) => {
              console.log(task);
              if (task > 0) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                  `{"Faculty":"${result[0][0].FACULTY}","Faculty_name":"${result[0][0].FACULTY_NAME}"}`
                );
              } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                  `{"error":"1","messsage":"no faculty"}`
                );
              }
            })
            .catch((err) => {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(err));
            });
        });
    } else if (
      url.parse(req.url).pathname.search("/api/pulpits/[A-я]+") != -1
    ) {
      let p = url.parse(req.url, true);
      let r = decodeURI(p.pathname).split("/");
      let o = r[3];
      sequelize
        .query(
          "SELECT PULPIT,PULPIT_NAME,FACULTY FROM PULPIT where PULPIT='" +
            o +
            "'"
        )
        .then((result) => {
          Pulpit.destroy({ where: { pulpit: o } })
            .then((task) => {
              console.log(task);
              if (task > 0) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                  `{"Pulpit":"${result[0][0].PULPIT}","Pulpit_name":"${result[0][0].PULPIT_NAME}","Faculty":"${result[0][0].FACULTY}"}`
                );
              } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                  `{"error":"1","messsage":"no pulpit"}`
                );
              }
            })
            .catch((err) => {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(err));
            });
        });
    } else if (
      url.parse(req.url).pathname.search("/api/subjects/[%-я]+") != -1
    ) {
      let p = url.parse(req.url, true);
      let r = decodeURI(p.pathname).split("/");
      let o = r[3];
      sequelize
        .query(
          "SELECT SUBJECT,SUBJECT_NAME,PULPIT FROM SUBJECT where SUBJECT='" +
            o +
            "'"
        )
        .then((result) => {
          Subject.destroy({ where: { subject: o } })
            .then((task) => {
              if (task > 0) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                  `{"Subject":"${result[0][0].SUBJECT}","Subject_name":"${result[0][0].SUBJECT_NAME}","Pulpit":"${result[0][0].PULPIT}"}`
                );
              } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                  `{"error":"1","messsage":"no subject"}`
                );
              }
            })
            .catch((err) => {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(err));
            });
        });
    } else if (
      url.parse(req.url).pathname.search("/api/auditoriumstypes/[A-я]+") != -1
    ) {
      let p = url.parse(req.url, true);
      let r = decodeURI(p.pathname).split("/");
      let o = r[3];
      sequelize
        .query(
          "SELECT AUDITORIUM_TYPE,AUDITORIUM_TYPENAME FROM AUDITORIUM_TYPE where AUDITORIUM_TYPE='" +
            o +
            "'"
        )
        .then((result) => {
          Auditorium_type.destroy({ where: { auditorium_type: o } })
            .then((task) => {
              if (task > 0) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                  `{"Audtiorium_type":"${result[0][0].AUDITORIUM_TYPE}","Auditorium_typename":"${result[0][0].AUDITORIUM_TYPENAME}"}`
                );
              } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                  `{"error":1,"message":"no aud type"}`
                );
              }
            })
            .catch((err) => {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(err));
            });
        });
    } else if (
      url.parse(req.url).pathname.search("/api/auditoriums/[A-я]+") != -1
    ) {
      let p = url.parse(req.url, true);
      let r = decodeURI(p.pathname).split("/");
      let o = r[3];
      sequelize
        .query(
          "SELECT AUDITORIUM,AUDITORIUM_NAME,AUDITORIUM_CAPACITY,AUDITORIUM_TYPE FROM AUDITORIUM where AUDITORIUM='" +
            o +
            "'"
        )
        .then((result) => {
          Auditorium.destroy({ where: { auditorium: o } })
            .then((task) => {
              console.log(task);
              if (task > 0) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                  `{"Auditorium":"${result[0][0].AUDITORIUM}","Auditorium_name":"${result[0][0].AUDITORIUM_NAME}","Auditorium_capacity":${result[0][0].AUDITORIUM_CAPACITY}, "Auditorium_type":${result[0][0].AUDITORIUM_TYPE}}`
                );
              } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                  `{"error":1,"message":"no such auditorium"}`
                );
              }
            })
            .catch((err) => {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(err));
            });
        });
      }break;
  }
};

var server = http
  .createServer(function (req, res) {
    try {
      http_handler(req, res);
    } catch (e) {
      console.error(e);
    }
  })
  .listen(5000)

  sequelize
        .authenticate() //проверка соединения
        .then(() => {
          console.log('database connected');
        })
        .catch((err) => {
          console.log(
            "Error db connection ",
            err
          );
        });
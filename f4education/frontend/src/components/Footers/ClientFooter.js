import React from "react";
import { Link } from "react-router-dom";
import { Container } from "reactstrap";
import logo from "../../assets/img/brand/f4.png";

const ClientFooter = () => {
  return (
    <>
      <Container>
        <footer style={{ marginTop: "100px" }}>
          <hr style={{ color: "rgb(158, 158, 158)" }} />
          <div className="d-flex justify-content-between flex-wrap text-start">
            {/* Item */}
            <div className="d-flex flex-column" style={{ maxWidth: "350px" }}>
              <div className="flex flex-column font-weight-700 mb-3">
                <span
                  className="text-dark font-weight-700"
                  style={{ fontSize: "25px" }}
                >
                  Thông tin
                </span>{" "}
                <br />
                <span
                  className="text-dark font-weight-700 text-line-end"
                  style={{ fontSize: "25px" }}
                >
                  liên lạc
                </span>
              </div>
              <p
                style={{ color: "rgb(158, 158, 158)" }}
                className="font-weight-500 text-muted"
              >
                Hãy liên hệ với chúng tôi bất cứ lúc nào. Chúng tôi thích nói
                chuyện qua email hơn. Tôi có thể trả lời email của bạn trong vài
                giờ.
              </p>
              <div className="d-flex flex-column">
                <p className="mb-0">
                  <span
                    style={{ color: "rgb(158, 158, 158)" }}
                    className="font-weight-400"
                  >
                    Email:
                  </span>
                  <a
                    href="mailTo:tronghientran18@gmail.com"
                    className="text-dark font-weight-600 ml-2"
                  >
                    f4education@gmail.com
                  </a>
                </p>
                <p className="mt-0">
                  <span
                    style={{ color: "rgb(158, 158, 158)" }}
                    className="font-weight-400"
                  >
                    Phone:
                  </span>
                  <span className="text-dark font-weight-600 ml-2">
                    +84 706802119
                  </span>
                </p>
              </div>
            </div>
            
            {/* Item */}
            <div className="d-flex flex-column">
              <div className="flex flex-column font-weight-700 mb-3">
                <span
                  className="text-dark font-weight-700"
                  style={{ fontSize: "25px" }}
                >
                  Mạng xã hội và
                </span>
                <br />
                <span
                  className="text-dark font-weight-700 text-line-end"
                  style={{ fontSize: "25px" }}
                >
                  công việc
                </span>
              </div>
              <ul className="list-unstyled">
                <li>
                  <a
                    href="https://www.facebook.com/tran.trong.hien.vl/"
                    className="text-decoration-none text-dark font-weight-700"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/hientt1803"
                    className="text-decoration-none text-dark font-weight-700"
                  >
                    Github
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/hi%E1%BA%BFn-tr%E1%BA%A7n-49b774256/"
                    className="text-decoration-none text-dark font-weight-700"
                  >
                    linkedIn
                  </a>
                </li>
              </ul>
            </div>
           
            {/* item */}
            <div className="d-flex flex-column">
              <div className="flex flex-column font-weight-700 mb-3">
                <span
                  className="text-dark font-weight-700"
                  style={{ fontSize: "25px" }}
                >
                  Tổng quan
                </span>
                <br />
                <span
                  className="text-dark font-weight-700 text-line-end"
                  style={{ fontSize: "25px" }}
                >
                  trang web
                </span>
              </div>
              <ul className="list-unstyled">
                <li>
                  <a
                    href="/"
                    className="text-decoration-none text-dark font-weight-700"
                  >
                    Trang chủ
                  </a>
                </li>
                <li>
                  <a
                    href="/course"
                    className="text-decoration-none text-dark font-weight-700"
                  >
                    Khóa học
                  </a>
                </li>
                <li>
                  <a
                    href="/#"
                    className="text-decoration-none text-dark font-weight-700"
                  >
                    Liên hệ
                  </a>
                </li>
              </ul>
            </div>

            {/* Item */}
            <div className="d-flex flex-column">
              <span className="text-white">.</span>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-4">
            <span className="font-weight-700">
              <img src={logo} alt="" width={40} heihg={40} />
            </span>
            <span className="font-weight-700">@2023, Inc</span>
          </div>
        </footer>
      </Container>
    </>
  );
};

export default ClientFooter;
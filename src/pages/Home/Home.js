import React, { useState, useEffect, createRef } from "react";
import Header from "../../components/Header/Header";
import "./Home.css";
import Modal from "react-awesome-modal";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  selectBalance,
  selectGuestBalance,
  selectUser,
  setBalanceAmount,
  setGuestBalanceAmount,
} from "../../features/userSlice";
import { v4 as uuidv4 } from "uuid";
import PreviousSpinTable from "../../components/PreviousSpinTable/PreviousSpinTable";
import Footer from "../../components/Footer/Footer";

function Home() {
  const user = useSelector(selectUser);
  const [visible, setVisible] = useState(false);
  const allSymbols = ["♠", "♣", "♥", "♦"];
  const [slot1, setslot1] = useState(
    allSymbols[Math.floor(Math.random() * allSymbols.length)]
  );
  const [slot2, setslot2] = useState(
    allSymbols[Math.floor(Math.random() * allSymbols.length)]
  );
  const [slot3, setslot3] = useState(
    allSymbols[Math.floor(Math.random() * allSymbols.length)]
  );
  const balance = useSelector(selectBalance);
  const guestBalance = useSelector(selectGuestBalance);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const slotRef = [createRef(), createRef(), createRef()];
  // const [rolling, setRolling] = useState(false);

  useEffect(() => {
    let retrievedData = JSON.parse(localStorage.getItem("data"));
    if (retrievedData) {
      setData(retrievedData);
    }
    dispatch(setGuestBalanceAmount(999));
    // dispatch(setBalanceAmount(30));
  }, []);

  console.log({ guestBalance });

  const getIdenticalCount = (x, y, z) => {
    if (x == y && y == z) {
      if (x === "♠") {
        return 5;
      } else {
        return 2;
      }
    }

    if (x == y || y == z || z == x) {
      return 0.5;
    }

    return 0;
  };

  const handleSpin1 = () => {
    if (balance >= 2 || guestBalance >= 2) {
      // setRolling(true);
      // setTimeout(() => {
      //   setRolling(false);
      // }, 700);
      let x, y, z;
      slotRef.forEach((slot, i) => {
        // this will trigger rolling effect
        const selected = triggerSlotRotation(slot.current);
        if (i === 0) {
          x = selected;
        } else if (i === 1) {
          y = selected;
        } else {
          z = selected;
        }
      });

      setslot1(x);
      setslot2(y);
      setslot3(z);

      if (user) {
        let temp = balance - 2 + getIdenticalCount(x, y, z);
        dispatch(setBalanceAmount(temp));
      } else {
        let temp1 = guestBalance - 2 + getIdenticalCount(x, y, z);
        dispatch(setGuestBalanceAmount(temp1));
      }

      setData([
        ...data,
        {
          id: uuidv4(),
          item1: slot1,
          item2: slot2,
          item3: slot3,
          time: new Date(),
        },
      ]);

      localStorage.setItem("data", JSON.stringify(data));
    } else {
      alert("You dont have sufficient balance to spin.");
    }
  };

  const triggerSlotRotation = (ref) => {
    function setTop(top) {
      ref.style.top = `${top}px`;
    }
    let options = ref.children;
    let randomOption = Math.floor(Math.random() * allSymbols.length);
    let choosenOption = options[randomOption];
    setTop(-choosenOption.offsetTop + 2);
    return allSymbols[randomOption];
  };

  const handleSpin2 = () => {
    setslot1("♠");
    setslot2("♠");
    setslot3("♠");
    setData([
      ...data,
      {
        id: uuidv4(),
        item1: slot1,
        item2: slot2,
        item3: slot3,
        time: new Date(),
      },
    ]);

    localStorage.setItem("data", JSON.stringify(data));
  };

  return (
    <div className="home">
      <Header />
      <div className="home__top">
        <div className="playButton" onClick={() => setVisible(true)}>
          Play a Game
        </div>
        <Modal
          visible={visible}
          width="80%"
          height="80%"
          effect="fadeInUp"
          onClickaway={() => setVisible(false)}
          style={{ backgroundColor: "#111" }}
        >
          <div className="game__container">
            <div className="game">
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    style={{
                      width: "200px",
                      height: "100px",
                      borderRadius: "10px",
                      objectFit: "cover",
                      marginBottom: "15px",
                    }}
                    src="/images/logo.jpg"
                    alt="CASINO"
                  />
                </div>
                <div className="game__slots">
                  <div className="slot">
                    <section>
                      <div className="container" ref={slotRef[0]}>
                        {allSymbols.map((symbol, i) => (
                          <div key={i}>
                            <span>{symbol}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                  <div className="slot">
                    <section>
                      <div className="container" ref={slotRef[1]}>
                        {allSymbols.map((symbol, i) => (
                          <div key={i}>
                            <span>{symbol}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                  <div className="slot">
                    <section>
                      <div className="container" ref={slotRef[2]}>
                        {allSymbols.map((symbol, i) => (
                          <div key={i}>
                            <span>{symbol}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                  }}
                >
                  <div
                    className={` ${
                      user
                        ? balance <= 2
                          ? "spin__button spin__inactive"
                          : "spin__button spin__active"
                        : guestBalance <= 2
                        ? "spin__button spin__inactive"
                        : "spin__button spin__active"
                    }`}
                    onClick={handleSpin1}
                  >
                    {user
                      ? balance >= 2
                        ? "SPIN"
                        : "CANT SPIN"
                      : guestBalance >= 2
                      ? "SPIN"
                      : "CANT SPIN"}
                  </div>
                  <div
                    className="spin__button spin__active"
                    onClick={handleSpin2}
                  >
                    FAKE SPIN
                  </div>
                </div>
              </div>
            </div>
            <div className="instructions">
              <h2>Instructions</h2>
              <h5>First Spin</h5>
              <ul>
                <li>
                  Each spin cost $2 from the balance amount, if you dont have $2
                  it won't spin.
                </li>
                <li>If you get ♠ ♠ ♠ , $5 will be added to your balance.</li>
                <li>
                  If you get all three identical symbols other than spade ♠ , $2
                  will be added to your balance.
                </li>
                <li>
                  If you get two identical symbols out of three , $0.5 will be
                  added to your balance.
                </li>
                <li>You cannot play when you run out of money</li>
              </ul>
              <h5>Fake Spin</h5>
              <ul>
                <li>This is for trial, it fakes ♠ ♠ ♠</li>
              </ul>
            </div>
            <IconButton
              style={{ position: "absolute", top: "20px", right: "20px" }}
              onClick={() => {
                setVisible(false);
                setslot1(
                  allSymbols[Math.floor(Math.random() * allSymbols.length)]
                );
                setslot2(
                  allSymbols[Math.floor(Math.random() * allSymbols.length)]
                );
                setslot3(
                  allSymbols[Math.floor(Math.random() * allSymbols.length)]
                );
              }}
            >
              <CloseIcon />
            </IconButton>
          </div>
        </Modal>
      </div>
      <div className="home__body">
        <PreviousSpinTable tableData={data} />
      </div>
      <Footer />
    </div>
  );
}

export default Home;

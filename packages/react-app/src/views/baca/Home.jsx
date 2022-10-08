import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Web3 from "web3";
import contracts from "../../contracts/external_contracts";
import RPC from "../../hooks/web3RPC";
import "./Home.css";

const pools = [
  {
    id: 1,
    name: "Trip to Cartagena!",
    goal: 1000,
    currency: "USDC",
    days: 31,
    winnerSelected: false,
    participants: [
      {
        username: "Leon",
        avatar: "/images/leon.png",
        contribution: 410,
      },
      {
        username: "Jose",
        avatar: "/images/jose.png",
        contribution: 101,
      },
    ],
  },
  {
    id: 2,
    name: "Trip to Canada!",
    goal: 1000,
    currency: "USDC",
    days: 31,
    winnerSelected: true,
    winner: "Jose",
    participants: [
      {
        username: "Leon",
        avatar: "/images/leon.png",
        contribution: 410,
      },
      {
        username: "Jose",
        avatar: "/images/jose.png",
        contribution: 101,
      },
    ],
  },
];

function PoolItem({ data }) {
  const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
  const winnerSpan = (
    <span className="green-text">
      This savings pool has ended. <b>{data.winner}</b> has won the reward for fulfilling his commitment first.
    </span>
  );
  const openButton = (
    <Link to={`/pool/${data.id}`}>
      <span className="btn btn-lg btn-blue">Enter pool</span>
    </Link>
  );
  return (
    <div className="pool-item">
      <header>
        <h4>{data.name}</h4>
        <p>
          Save{" "}
          <b>
            {formatter.format(data.goal)} {data.currency}
          </b>{" "}
          in <b>{data.days} days</b>.
        </p>
      </header>
      <div>
        <h5 className="uppercase">Pool participants ({data.participants.length})</h5>
        <ul className="screen--user-list">
          {data.participants.map(participant => (
            <li ket={participant.username}>
              <img alt={participant.username} src={participant.avatar} />
              <span className="uppercase">
                <b>{participant.username}</b>
              </span>
            </li>
          ))}
        </ul>
      </div>
      {data.winnerSelected ? winnerSpan : openButton}
    </div>
  );
}

/**
 * Home screen.
 * @returns react component
 **/
function Home({ username, provider }) {
  const [address, setAddress] = useState();
  const [contract, setContract] = useState();
  const [userPools, setUserPools] = useState();

  useEffect(() => {
    async function fetchData() {
      setAddress(await RPC.getAccounts(provider));
      const web3 = new Web3(provider);
      const SavingsPool = contracts[1].contracts.SavingsPool;
      const response = new web3.eth.Contract(SavingsPool.abi, SavingsPool.address);
      setContract(response);
    }
    fetchData();
  }, [provider]);

  useEffect(() => {
    async function fetchData() {
      if (contract) {
        const response = await contract.methods.getSavingPoolsIndexesPerUser(address).call();
        setUserPools(response);
      }
    }
    fetchData();
  }, [address, contract]);

  if (userPools) {
    console.log("userPools", userPools);
  }

  return (
    <div id="home" className="screen">
      <header id="screen--header">
        <div id="screen--illustration"></div>
        <h1 id="screen--title">Welcome back, {username}!</h1>
      </header>
      <div id="screen--main">
        <h3>Your existing pools</h3>
        {pools.map(pool => (
          <PoolItem key={pool.id} data={pool} />
        ))}
      </div>
      <footer id="screen--footer">
        <Link to="/new">
          <div id="footer-btn">
            <div className="btn-group">
              <span className="btn-label">Add a new pool</span> <span className="btn-add btn-blue">+</span>
            </div>
          </div>
        </Link>
      </footer>
    </div>
  );
}

export default Home;
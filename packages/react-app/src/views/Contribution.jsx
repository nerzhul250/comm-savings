import { BigNumber } from "ethers";
import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { daysLeftStr, ethToWei, fromContractDataToAppData, weiToEthFormatted } from "../helpers";
import { poolContract } from "../hooks";
import "./Contribution.css";

/**
 * Contribution screen.
 * @returns react component
 **/
function Contribution({ contract, address }) {
  const { id } = useParams();
  const history = useHistory();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState("Make contribution");
  const [amount, setAmount] = useState(0);
  const [pool, setPool] = useState({});
  const [maximumAllowed, setMaximumAllowed] = useState(0);
  const [currentContribution, setCurrentContribution] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setPool(fromContractDataToAppData(await poolContract.getPool(contract, id)));
      setMaximumAllowed(await poolContract.getMaximumAllowedContributionPerUserInPool(contract, id, address));
      setCurrentContribution(await poolContract.getCurrentContributionPerUserInPool(contract, id, address));
    }
    fetchData();
  }, [contract, !pool, !maximumAllowed, !currentContribution]);

  const onClickContribute = async e => {
    if (contract) {
      setButtonDisabled(true);
      setButtonText("Processing...");
      const ethAmount = ethToWei(amount);
      await poolContract.contributeToSavingPool(contract, id, address, BigNumber.from(`${ethAmount}`));
      history.push(`/confirmation/${id}/${ethAmount}`);
    }
  };

  return (
    <div id="contribution" className="screen">
      <header id="screen--header">
        <div id="screen--illustration"></div>
        <div className="title-bar">
          <Link to={`/pool/${id}`} id="goback-btn"></Link>
          <h4>Contribute to your goal</h4>
        </div>
      </header>
      <div id="screen--main">
        <div>
          <h3>Enter a contribution</h3>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <div>
          <h5 className="uppercase">Maximum allowed</h5>
          <h4>{weiToEthFormatted(maximumAllowed)}</h4>
        </div>
        <div>
          <h5 className="uppercase">Current contribution</h5>
          <h4>{weiToEthFormatted(currentContribution)}</h4>
        </div>
      </div>
      <footer id="screen--footer">
        <button onClick={onClickContribute} className="btn btn-lg btn-blue" disabled={buttonDisabled}>
          {buttonText}
        </button>
        <h4>{daysLeftStr(pool?.startDate, pool?.endDate)}</h4>
      </footer>
    </div>
  );
}

export default Contribution;

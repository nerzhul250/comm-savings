const poolContract = (() => {
  const claimSavings = async (contract, index, address) => {
    return await contract.methods.claimSavings(index).send({ from: address });
  };

  const createSavingPool = async (contract, address, name, individualGoal, endDate) => {
    const startDate = new Date().getTime();
    return await contract.methods.createSavingPool(name, individualGoal, startDate, endDate).send({ from: address });
  };

  const contributeToSavingPool = async (contract, index, address, amount) => {
    return await contract.methods.contributeToSavingPool(index).send({ from: address, value: amount });
  };

  const getUserPools = async (contract, address) => {
    const response = await contract.methods.getSavingPoolsIndexesPerUser(address).call();
    const rpools = await Promise.all(
      response.map(async index => {
        return await contract.methods.savingPools(index).call();
      }),
    );
    return rpools;
  };

  const getPool = async (contract, index) => {
    return await contract.methods.savingPools(index).call();
  };

  const getContributorsFromPool = async (contract, index) => {
    const response = await contract.methods.getContributorsInPool(index).call();
    return response;
  };

  const getCurrentContributionPerUserInPool = async (contract, index, address) => {
    const response = await contract.methods.getCurrentContributionPerUserInPool(index, address).call();
    return response;
  };

  const getMaximumAllowedContributionPerUserInPool = async (contract, index, address) => {
    const response = await contract.methods.getMaximumAllowedContributionPerUserInPool(index, address).call();
    return response;
  };

  return {
    claimSavings,
    createSavingPool,
    contributeToSavingPool,
    getUserPools,
    getPool,
    getContributorsFromPool,
    getCurrentContributionPerUserInPool,
    getMaximumAllowedContributionPerUserInPool,
  };
})();

export default poolContract;
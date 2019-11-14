export async function initRoutine ({ dispatch }) {

    dispatch('fetchSettings');
    dispatch('fetchAllowedFeeTokens');
}

export async function fetchSettings ({ state, commit }) {
    let res = await this._vm.$eos.rpc.get_table_rows({
        json: true,
        code: state.config.cron_contract,
        scope: state.config.cron_contract,
        table: "settings",
        limit: 1
      });
      if(res && res.rows.length){
        console.log('fetched settings',res.rows[0]);

        res = res.rows[0];

        commit('setSettings', res);
      }
      else{
          console.log('fetching settings failed');
      }
}

export async function fetchAllowedFeeTokens ({ state, commit }) {

  let res = await this._vm.$eos.rpc.get_table_rows({
      json: true,
      code: state.config.cron_contract,
      scope: state.config.cron_contract,
      table: "gastokens",
      limit: -1
    });
    if(res && res.rows.length){
      console.log('fetched gastokens',res.rows);

      res = res.rows;

      res = res.map(aft =>{
        aft = aft.token; //we don't need the token key;
        let[amount, sym] = aft.quantity.split(' ');
        aft.sym = sym;
        aft.precision = amount.includes('.') ? amount.split('.')[1].length : 0;
        return aft;
      })

      commit('setAllowedFeeTokens', res);
    }
    else{
        console.log('fetching gastokens failed');
    }
}

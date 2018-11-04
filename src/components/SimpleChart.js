import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import axios from 'axios';
import { TimeSeries, Index } from "pondjs";
import {
  Resizable,
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  BarChart,
  styler
} from "react-timeseries-charts";
import { isNullOrUndefined } from 'util';
const setAuthorizationHeader = (token = null) => {
  if(token){
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
  else {
    delete axios.defaults.headers.common.Authorization;
  }
}

class SimpleChart extends React.Component {
  state = {
    data : this.props.data
  }
  fetchData = () =>{
     axios.get('http://localhost:3001/api/parts')
    .then(res => this.setState({data: res.data}));
  }
    componentDidMount() {
    // axios.get('http://localhost:3001/api/parts')
    // .then(res => this.setState({data: res.data}));
    this.fetchData()

    this.interval = setInterval(() => {
      this.fetchData()
    }, 10000)
    if(localStorage.tokenstore){
      this.setState({user: {token:localStorage.tokenstore}});
      setAuthorizationHeader(localStorage.tokenstore);
    }
    if(isNullOrUndefined(localStorage.tokenstore)){
      this.props.history.push('/');
    }
  }
  componentWillUnmount () {
    clearInterval(this.interval);
    this.setState({user: {token: null}});
  }
  render() {
    const series = new TimeSeries({
      name: "parts",
      columns: ["index", "parts"],
      points : this.state.data.map(([d, value]) => [
        Index.getIndexString("5min", new Date(d)),
        value
      ]) 
    });
    console.log("series is ", series);
    const style = styler([
      {
        key: "parts",
        color: "#A5C8E1",
        selected: "#2CB1CF"
      }
    ]);

    return (
      <div className="d-flex justify-content-center align-items-center container">
      { this.state.user !==isNullOrUndefined ?(
      <Resizable>
        <ChartContainer timeRange={series.range()}>
          <ChartRow height="150">
            <YAxis
              id="part"
              label="number of parts"
              min={0}
              max={1000}
              format="d"
              width="70"
              type="linear"
            />
            <Charts>
              <BarChart
                axis="part"
                style={style}
                spacing={1}
                columns={["parts"]}
                series={series}
                minBarHeight={1}
              />
            </Charts>
          </ChartRow>
        </ChartContainer>
      </Resizable>
      ) : (
        <Route path="/parts" render ={() =><Redirect to="" />}/>
      )}
      </div>
    // <div>
    //   parts
    // </div> 
    );
  }
}

export default  SimpleChart;
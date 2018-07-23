import React, { Component } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'

import { routesToogle } from '../../store/reducers/areas.reducer';


class DriversTable extends Component {

  handleVisibility = (route, status) => {
    this.props.routesToogle(route.driver, status);
  }

  render(){
    return (
      <div><table><tbody>
      <tr>
        <th>ACTIVE DRIVERS</th>
        <th>status</th>
        <th>action</th>
        <th>action</th>
      </tr>
      { this.props.routes ? this.props.routes.map((el) => (
        <tr key={el.driver}>
          <td>{el.driver}</td>
          <td>{el.visibility ? 'visible' : 'hidden'}</td>
          <td><button onClick={()=>this.handleVisibility(el, 'show')}>Show</button></td>
          <td><button onClick={()=>this.handleVisibility(el, 'hide')}>Hide</button></td>
        </tr>
      )) : <tr><td></td></tr>}
    </tbody></table></div>
    )
  }
}

const mapStateToProps = state => {
  return {
    routes: state.areas.routes
  }
}

const mapDispatchToProps = ( dispatch ) => {
  return {
    routesToogle: bindActionCreators( routesToogle, dispatch )
  };
};

export default connect( mapStateToProps, mapDispatchToProps )(DriversTable);




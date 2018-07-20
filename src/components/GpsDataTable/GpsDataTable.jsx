import React from "react";
import { connect } from 'react-redux'
import "./GpsDataTable.css";
import { fetchAreaPointsForDriver } from '../../store/actions/tracking.actions';

class GpsDataTable extends React.Component {
  componentDidMount() {
      this.props.fetchAreaPointsForDriver('default');
  }

  render = () => {
      return (
          <div>
          
          </div>
      )
  };
}

const mapStateToProps = state => ({
    
});

export default connect(mapStateToProps, { fetchAreaPointsForDriver })(GpsDataTable);

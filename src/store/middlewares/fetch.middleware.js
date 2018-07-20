import { FETCH_AREA_POINTS } from '../action.types';
import { POINTS_AFTER_MATCHING } from '../rest.methods';
import { restService } from '../../services/rest.service';
import { areaPointsHaveBeenFetched } from '../actions/tracking.actions';

export default ({ dispatch }) => next => async action => {
  if (action.type === FETCH_AREA_POINTS) {
    const pointsAfterMatching = await restService.get(`${POINTS_AFTER_MATCHING}/${action.driver}`);
    dispatch(areaPointsHaveBeenFetched(pointsAfterMatching));
  }
  next(action)
}
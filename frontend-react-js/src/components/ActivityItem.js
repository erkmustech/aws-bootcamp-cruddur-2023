import './ActivityItem.css';
<<<<<<< HEAD

import ActivityContent  from '../components/ActivityContent';
import ActivityActionReply  from '../components/ActivityActionReply';
import ActivityActionRepost  from '../components/ActivityActionRepost';
import ActivityActionLike  from '../components/ActivityActionLike';
import ActivityActionShare  from '../components/ActivityActionShare';

export default function ActivityItem(props) {

  let replies;
  if (props.activity.replies) {
    replies = <div className="replies">
                {props.activity.replies.map(reply => {
                return  <ActivityItem 
                  setReplyActivity={props.setReplyActivity} 
                  setPopped={props.setPopped} 
                  key={reply.uuid} 
                  activity={reply} 
                  />
                })}
              </div>
  }

  return (
    <div className='activity_item'>
      <ActivityContent activity={props.activity} />
      <div className="activity_actions">
        <ActivityActionReply setReplyActivity={props.setReplyActivity} activity={props.activity} setPopped={props.setPopped} activity_uuid={props.activity.uuid} count={props.activity.replies_count}/>
        <ActivityActionRepost activity_uuid={props.activity.uuid} count={props.activity.reposts_count}/>
        <ActivityActionLike activity_uuid={props.activity.uuid} count={props.activity.likes_count}/>
        <ActivityActionShare activity_uuid={props.activity.uuid} />
      </div>
      {replies}
=======
import { Link } from "react-router-dom";
import { DateTime } from 'luxon';
import {ReactComponent as BombIcon} from './svg/bomb.svg';
import {ReactComponent as ReplyIcon} from './svg/reply.svg';
import {ReactComponent as HeartIcon} from './svg/heart.svg';
import {ReactComponent as RepostIcon} from './svg/repost.svg';
import {ReactComponent as ShareIcon} from './svg/share.svg';

export default function ActivityItem(props) {

  const format_time_created_at = (value) => {
    // format: 2050-11-20 18:32:47 +0000
    const past = DateTime.fromISO(value)
    const now     = DateTime.now()
    const diff_mins = now.diff(past, 'minutes').toObject().minutes;
    const diff_hours = now.diff(past, 'hours').toObject().hours;

    if (diff_hours > 24.0){
      return past.toFormat("LLL L");
    } else if (diff_hours < 24.0 && diff_hours > 1.0) {
      return `${Math.floor(diff_hours)}h ago`;
    } else if (diff_hours < 1.0) {
      return `${Math.round(diff_mins)}m ago`;
    }
  };

  const format_time_expires_at = (value) => {
    // format: 2050-11-20 18:32:47 +0000
    const future = DateTime.fromISO(value)
    const now     = DateTime.now()
    const diff_mins = future.diff(now, 'minutes').toObject().minutes;
    const diff_hours = future.diff(now, 'hours').toObject().hours;
    const diff_days = future.diff(now, 'days').toObject().days;

    if (diff_hours > 24.0){
      return `${Math.floor(diff_days)}d`;
    } else if (diff_hours < 24.0 && diff_hours > 1.0) {
      return `${Math.floor(diff_hours)}h`;
    } else if (diff_hours < 1.0) {
      return `${Math.round(diff_mins)}m`;
    }
  };

  return (
    <div className='activity_item'>
        <div className='activity_avatar'></div>
        <div className='activity_content'>
          <div className='activity_meta'>
            <Link className='activity_identity' to={`/@`+props.activity.handle}>
              <div className='display_name'>{props.activity.display_name}</div>
              <div className="handle">@{props.activity.handle}</div>
            </Link>{/* activity_identity */}
            <div className='activity_times'>
              <div className="created_at" title={props.activity.created_at}>
                <span className='ago'>{format_time_created_at(props.activity.created_at)}</span> 
              </div>
              <div className="expires_at" title={props.activity.expires_at}>
                <BombIcon className='icon' />
                <span className='ago'>{format_time_expires_at(props.activity.expires_at)}</span>
              </div>
            </div>{/* activity_times */}
          </div>{/* activity_meta */}
          <div className="message">{props.activity.message}</div>
          <div className="activity_actions">
            <div className="action activity_action_reply">
              <ReplyIcon className='icon' />
            </div>
            <div className="action activity_action_repost">
              <RepostIcon className='icon' />
            </div>
            <div className="action activity_action_heart">
              <HeartIcon className='icon' />
            </div>
            <div className="action activity_action_share">
              <ShareIcon className='icon' />
            </div>
          </div>
        </div>{/* activity_content */}
>>>>>>> week0
    </div>
  );
}
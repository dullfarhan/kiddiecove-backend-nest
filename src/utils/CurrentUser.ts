// import Util from './Util';
// const { User } = require('../models/user');
// const adminService = require('../services/admins');
// const schoolAdminService = require('../services/schoolAdmin');
// const parentService = require('../services/parent');
// const teacherService = require('../services/teachers');
// const contextDebugger = Debug('app:utility:currentUser');

// import { AppService } from '../app.service';
// import Debug from 'debug';
// async function getCurrentUser(req, userType) {
//   try {
//     let currentUser;
//     contextDebugger('user id is ' + req.user._id);
//     const user = await User.findById(req.user._id).select('-password');
//     if (!user) Util.getBadResponse('Current User Not Found with given id');
//     contextDebugger('Current User Details Fetched Succesfully');
//     if (user.type !== userType)
//       return Util.getBadResponse('Current User Is Not ' + userType);
//     contextDebugger('Current User is ' + userType);
//     switch (user.type) {
//       case 'ADMIN':
//         currentUser = await adminService.getCurrentAdmin(user._id);
//         break;
//       case 'SCHOOL_ADMIN':
//         currentUser = await schoolAdminService.getCurrentSchoolAdmin(user._id);
//         break;
//       case 'PARENT':
//         currentUser = await parentService.getCurrentParent(user._id);
//         break;
//       case 'TEACHER':
//         currentUser = await teacherService.getCurrentTeacher(user._id);
//         break;
//       default:
//         return Util.getBadResponse('Current User Is Not ' + userType);
//     }
//     return !currentUser
//       ? Util.getBadResponse('Current User Not Found')
//       : Util.getOkResponse(
//           currentUser,
//           'Current User Details Fetched Succesfully',
//         );
//   } catch (ex) {
//     contextDebugger(ex);
//     return Util.getBadResponse(ex.message);
//   }
// }

// async function getCurrentUserDetails(req) {
//   try {
//     contextDebugger('user id is ' + req.user._id);
//     const user = await User.findById(req.user._id)
//       .select('-password')
//       .populate('address_id')
//       .exec();
//     if (!user) Util.getBadResponse('Current User Not Found with given id');
//     contextDebugger('Current User Details Fetched Succesfully');
//     return Util.getOkResponse(
//       user,
//       'Current User Self Details Fetched Succesfully',
//     );
//   } catch (ex) {
//     contextDebugger(ex);
//     return Util.getBadResponse(ex.message);
//   }
// }

// module.exports.getCurrentUser = getCurrentUser;
// module.exports.getCurrentUserDetails = getCurrentUserDetails;

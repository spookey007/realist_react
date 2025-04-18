import express from 'express';
import contactRoutes from './contactRoutes.js';
import appointmentRoutes from './appointmentRoutes.js';
import userRoutes from './userRoutes.js';
import userPermissionsRoutes from './userPermissionsRoutes.js';
import RolesRoutes from './RolesRoutes.js';
import InviteRoutes from './InviteRoutes.js';
import MenuRoutes from './MenuRoutes.js';
import propertiesRoutes from './propertiesRoutes.js';
import servicesRoutes from './servicesRoutes.js';
import serviceTypeRoutes from './serviceTypesRoutes.js';
import licenseRoutes from './licenseRoutes.js';

const router = express.Router();

// Use the imported routes
router.use('/contact', contactRoutes);
router.use('/appointment', appointmentRoutes);
router.use('/users', userRoutes);
router.use('/roles', RolesRoutes);
router.use('/user-permissions', userPermissionsRoutes);
router.use('/invites', InviteRoutes);
router.use('/menu', MenuRoutes);
router.use('/properties', propertiesRoutes);
router.use('/services', servicesRoutes);
router.use('/service-types', serviceTypeRoutes);
router.use('/external', licenseRoutes);

export default router;

// import api from './axios';
// import { Package, CreatePackageData, UpdatePackageData } from '@/types/package.types';

// interface APIResponse<T> {
//   success: boolean;
//   data?: T;
//   message?: string;
//   error?: string;
// }

// export const adminPackagesAPI = {
//   // Create package
//   createPackage: async (packageData: FormData): Promise<APIResponse<Package>> => {
//     try {
//       const response = await api.post<any>('/packages', packageData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       return {
//         success: true,
//         data: response.data.data,
//         message: response.data.message
//       };
//     } catch (error: any) {
//       console.error('❌ Create package error:', error.response?.data);
//       return {
//         success: false,
//         error: error.response?.data?.message || 'Failed to create package'
//       };
//     }
//   },

//   // Update package
//   updatePackage: async (id: string, packageData: FormData): Promise<APIResponse<Package>> => {
//     try {
//       const response = await api.put<any>(`/packages/${id}`, packageData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       return {
//         success: true,
//         data: response.data.data,
//         message: response.data.message
//       };
//     } catch (error: any) {
//       console.error('❌ Update package error:', error.response?.data);
//       return {
//         success: false,
//         error: error.response?.data?.message || 'Failed to update package'
//       };
//     }
//   },

//   // Delete package
//   deletePackage: async (id: string): Promise<APIResponse<void>> => {
//     try {
//       const response = await api.delete<any>(`/packages/${id}`);
//       return {
//         success: true,
//         message: response.data.message
//       };
//     } catch (error: any) {
//       console.error('❌ Delete package error:', error.response?.data);
//       return {
//         success: false,
//         error: error.response?.data?.message || 'Failed to delete package'
//       };
//     }
//   },

//   // Toggle active status
//   togglePackageStatus: async (id: string): Promise<APIResponse<Package>> => {
//     try {
//       const response = await api.patch<any>(`/packages/${id}/toggle-status`);
//       return {
//         success: true,
//         data: response.data.data,
//         message: response.data.message
//       };
//     } catch (error: any) {
//       console.error('❌ Toggle status error:', error.response?.data);
//       return {
//         success: false,
//         error: error.response?.data?.message || 'Failed to toggle status'
//       };
//     }
//   }
// };
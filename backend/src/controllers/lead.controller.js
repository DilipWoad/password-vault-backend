// import { prisma, statusEnum } from "../index.js";

// const createLead = async (req, res) => {
//   try {
//     //verify auth
//     // validated name email phone of user
//     const user = req.user;
//     const { name, email, phone, status } = req.body;
//     if (email.trim() === "") {
//       return res
//         .status(401)
//         .json({ message: "Email cannot be empty!", success: false });
//     }
//     if (name.trim() === "") {
//       return res
//         .status(401)
//         .json({ message: "Name cannot be empty!", success: false });
//     }
//     // if (phone?.trim() === "") {
//     //   return res
//     //     .status(401)
//     //     .json({ message: "Phone cannot be empty!", success: false });
//     // }
//     console.log(statusEnum);
//     if (status?.trim() === "" || !statusEnum.hasOwnProperty(status)) {
//       return res.status(403).json({
//         message: "Status should be New,InProgress or Converted",
//         success: false,
//       });
//     }

//     const lead = await prisma.lead.create({
//       data: {
//         name,
//         email,
//         phone: phone ? phone : "",
//         status,
//         userId: user.id,
//       },
//     });

//     return res.status(201).json({
//       data: lead,
//       message: "New Lead created successfully!",
//       success: true,
//     });
//   } catch (error) {
//     console.error(`Error while creating Lead : ${error}`);
//     return res.status(500).json({
//       message: "Something went wrong while creating lead.",
//       success: false,
//       details: error.message,
//     });
//   }
// };

// const getAllLeads = async (req, res) => {
//   try {
//     //verify auth
//     // validated name email phone of user
//     const leads = await prisma.lead.findMany({
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     return res.status(201).json({
//       data: leads,
//       message: "All Leads fetched successfully!",
//       success: true,
//     });
//   } catch (error) {
//     console.error(`Error while featching Leads : ${error}`);
//     return res.status(500).json({
//       message: "Something went wrong while featching leads.",
//       success: false,
//     });
//   }
// };

// //update status
// const changeStatus = async (req, res) => {
//   try {
//     //verifyJWT
//     //check if i am authorize to change the status
//     const user = req.user;
//     const { leadId } = req.params;
//     const { status } = req.body;
//     console.log(statusEnum);
//     if (status.trim() === "" || !statusEnum.hasOwnProperty(status)) {
//       return res.status(401).json({
//         message:
//           "Status can't be empty and it should be new,inprogress or converted.",
//       });
//     }
//     //check if lead exits
//     const lead = await prisma.lead.findUnique({
//       where: {
//         id: parseInt(leadId),
//       },
//     });
//     if (!lead) {
//       return res
//         .status(404)
//         .json({ message: "Lead does not exists.", success: false });
//     }
//     //if lead found now match current user id with the leads userId
//     if (lead.userId !== user.id) {
//       return res
//         .status(401)
//         .json({ message: "You don't have permission.", success: false });
//     }
//     //if matched then only i can change the status
//     const changedStatus = await prisma.lead.update({
//       where: {
//         id: parseInt(leadId),
//       },
//       data: {
//         status,
//       },
//     });

//     return res.status(200).json({
//       message: `Status updated to ${status} successfully.`,
//       data: changedStatus,
//       success: true,
//     });
//     //upadte the status
//   } catch (error) {
//     console.error(`Error while updating Status : ${error}`);
//     return res.status(500).json({
//       message: "Something went wrong while updating Status.",
//       success: false,
//       details: error.message,
//     });
//   }
// };

// const deleteLead = async (req, res) => {
//   try {
//     //verifyJWT
//     //check if i am authorize to change the status
//     const user = req.user;
//     const { leadId } = req.params;
//     //check if lead exits
//     const lead = await prisma.lead.findUnique({
//       where: {
//         id: parseInt(leadId),
//       },
//     });
//     if (!lead) {
//       return res
//         .status(404)
//         .json({ message: "Lead does not exists.", success: false });
//     }
//     //if lead found now match current user id with the leads userId
//     if (lead.userId !== user.id) {
//       return res
//         .status(401)
//         .json({ message: "You don't have permission.", success: false });
//     }
//     //if matched then only i can change the status
//     const deleteLead = await prisma.lead.delete({
//       where: {
//         id: parseInt(leadId),
//       },
//     });

//     return res.status(200).json({
//       message: `Lead deleted successfully.`,
//       data: [],
//       success: true,
//     });
//     //upadte the status
//   } catch (error) {
//     console.error(`Error while deleting Lead : ${error}`);
//     return res.status(500).json({
//       message: "Something went wrong while deleting Lead.",
//       success: false,
//       details: error.message,
//     });
//   }
// };
// export { createLead, getAllLeads, changeStatus, deleteLead };

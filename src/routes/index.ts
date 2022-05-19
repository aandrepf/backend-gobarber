import { Router } from "express";

import appointmentsRouter from "./appointments.routes";
import sessionsRouter from "./sessions.routes";
import usersRouter from "./users.routes";
import transactionsRouter from "./transactions.routes";

const routes = Router();

// passando /appointments no appointmentsRouter não preciso passar ela novamente
// posso usar somente o /
routes.use("/appointments", appointmentsRouter);
routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/transactions", transactionsRouter);

export default routes;

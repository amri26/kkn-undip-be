const { Router } = require("express");
const modules = require("../modules/proposal.modules");
const response = require("../helpers/response");
const {
  userSession,
  isActive,
  verifyAdmin,
  verifyReviewer,
  verifyDosen,
} = require("../helpers/middleware");
const multer = require("multer");
const upload = multer();

const app = Router();

app.get("/tema/:id_tema", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.listProposal(Number(req.params.id_tema))
  );
});

app.get("/dosen", userSession, verifyDosen, async (req, res, next) => {
  response.sendResponse(res, await modules.listProposalDosen(req.user.id));
});

app.get(
  "/dosen/tema/:id_tema",
  userSession,
  verifyDosen,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.listProposalDosenTema(
        req.user.id,
        Number(req.params.id_tema)
      )
    );
  }
);

app.get("/detail/:id_proposal", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.getProposal(Number(req.params.id_proposal))
  );
});

app.post(
  "/",
  userSession,
  verifyDosen,
  upload.single("file"),
  async (req, res, next) => {
    const check = await isActive(
      Number(req.body.id_tema),
      Number(process.env.DOSEN_PROPOSAL)
    );

    if (!check.status) {
      response.sendResponse(res, check);
    } else {
      response.sendResponse(
        res,
        await modules.addProposal(req.file, req.user.id, req.body)
      );
    }
  }
);

app.delete("/:id_proposal", userSession, async (req, res, next) => {
  response.sendResponse(
    res,
    await modules.deleteProposal(Number(req.params.id_proposal))
  );
});

app.put(
  "/acc/:id_proposal",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.accProposal(Number(req.params.id_proposal))
    );
  }
);

app.put(
  "/dec/:id_proposal",
  userSession,
  verifyAdmin,
  async (req, res, next) => {
    response.sendResponse(
      res,
      await modules.decProposal(Number(req.params.id_proposal))
    );
  }
);

app.put("/evaluate", userSession, verifyReviewer, async (req, res, next) => {
  response.sendResponse(res, await modules.evaluateProposal(req.body));
});

module.exports = app;

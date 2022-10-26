import { CardActions, CardContent } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import Uploader from "../components/Uploader";
import SchematicType from "../enums/schematic-type";
import EnhancedSchematicViewer from "../components/EnhancedSchematicViewer";
import Button from "@material-ui/core/Button";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import save from "save-file";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import DownloadIcon from "@material-ui/icons/GetApp";
import { arrayBufferToBase64 } from "../utils/buffers";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
  },
  viewerContainer: {
    display: "flex",
    justifyContent: "center",
  },
  viewerCard: {
    width: 700,
  },
  card: {
    minWidth: "100%",
  },
  cardContent: {
    padding: theme.spacing(2),
    "&:last-child": {
      paddingBottom: theme.spacing(2),
    },
  },
  cardActions: {
    margin: "0 auto",
  },
  progress: {
    marginTop: theme.spacing(2),
  },
}));

const displayFileType = (schematicType: SchematicType) => {
  switch (schematicType) {
    case SchematicType.SPONGE:
      return "Sponge (.schem) file";
    case SchematicType.MCEDIT:
      return "MCEdit (.schematic) file";
    case SchematicType.STRUCTURE:
      return "Minecraft Structure (.nbt) file";
  }
};

const ViewerPage = () => {
  const classes = useStyles();
  const [error, showError] = useState<string | null>(null);
  const [schematic, setSchematic] = useState<{
    type: SchematicType;
    file: File;
  } | null>(null);
  const [schem, setSchem] = useState<{ file: File; base64: string } | null>(
    null
  );

  const handleUpload = async (schematic: {
    type: SchematicType;
    file: File;
  }) => {
    setSchematic(schematic);

      const buffer: ArrayBuffer = await schematic.file.arrayBuffer();
      setSchem({ file: schematic.file, base64: arrayBufferToBase64(buffer) });


  };

  const handleClose = () => {
    setSchematic(null);
    setSchem(null);
  };

  let card;
  if (schematic && schem) {
    card = (
      <Card className={classes.viewerCard}>
        <CardHeader
          title={schematic.file.name}
          subheader={displayFileType(schematic.type)}
          action={
            <IconButton aria-label="delete" onClick={handleClose}>
              <ClearIcon />
            </IconButton>
          }
        />
        <CardContent>
          <div className={classes.viewerContainer}>
            <EnhancedSchematicViewer schematic={schem.base64} />
          </div>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Button
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={async () => {
              await save(schem.file, schematic.file.name);
            }}
          >
            Download as .schem file
          </Button>
        </CardActions>
      </Card>
    );
  } else {
    card = (
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Uploader onUpload={handleUpload} />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Container className={classes.container}>{card}</Container>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={!!error}
        autoHideDuration={4000}
        onClose={() => showError(null)}
      >
        <Alert severity="error" elevation={6} variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ViewerPage;

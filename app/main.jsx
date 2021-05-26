import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Upload } from '@progress/kendo-react-upload';
const fileStatuses = ['UploadFailed', 'Initial', 'Selected', 'Uploading', 'Uploaded', 'RemoveFailed', 'Removing'];

const App = () => {
  const [files, setFiles] = React.useState([]);
  const [events, setEvents] = React.useState([]);
  const [filePreviews, setFilePreviews] = React.useState({});
  const [affectedFiles, setAffectedFiles] = React.useState([]);
  React.useEffect(() => {
    affectedFiles.filter(file => !file.validationErrors).forEach(file => {
      const reader = new FileReader();

      reader.onloadend = ev => {
        setFilePreviews({ ...filePreviews,
          [file.uid]: ev.target.result
        });
      };

      reader.readAsDataURL(file.getRawFile());
    });
  }, [affectedFiles, filePreviews]);

  const onAdd = event => {
    setFiles(event.newState);
    setEvents([...events, `File selected: ${event.affectedFiles[0].name}`]);
    setAffectedFiles(event.affectedFiles);
  };

  const onRemove = event => {
    let newFilePreviews = { ...filePreviews
    };
    event.affectedFiles.forEach(file => {
      delete newFilePreviews[file.uid];
    });
    setFiles(event.newState);
    setEvents([...events, `File removed: ${event.affectedFiles[0].name}`]);
    setFilePreviews(newFilePreviews);
  };

  const onProgress = event => {
    setFiles(event.newState);
    setEvents([...events, `On Progress: ${event.affectedFiles[0].progress} %`]);
  };

  const onStatusChange = event => {
    const file = event.affectedFiles[0];
    setFiles(event.newState);
    setEvents([...events, `File '${file.name}' status changed to: ${fileStatuses[file.status]}`]);
  };

  return <div>
        <Upload batch={false} multiple={true} files={files} onAdd={onAdd} onRemove={onRemove} onProgress={onProgress} onStatusChange={onStatusChange} withCredentials={false} saveUrl={'https://demos.telerik.com/kendo-ui/service-v4/upload/save'} removeUrl={'https://demos.telerik.com/kendo-ui/service-v4/upload/remove'} />
        <div className={'example-config'} style={{
      marginTop: 20
    }}>
          <ul className={'event-log'}>
            {events.map((event, index) => <li key={index}>{event}</li>)}
          </ul>
        </div>
        {files.length ? <div className={'img-preview example-config'}>
                      <h3>Preview selected images</h3>
                      {Object.keys(filePreviews).map((fileKey, index) => <img src={filePreviews[fileKey]} alt={'image preview'} style={{
        width: 200,
        margin: 10
      }} key={index} />)}
                    </div> : undefined}
      </div>;
};

ReactDOM.render(<App />, document.querySelector('my-app'));
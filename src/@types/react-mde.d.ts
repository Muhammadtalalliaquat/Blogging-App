
declare module 'react-mde' {
    import * as React from 'react';
  
    interface ReactMdeProps {
      value: string;
      onChange: (value: string) => void;
      selectedTab: 'write' | 'preview';
      onTabChange: (tab: 'write' | 'preview') => void;
      generateMarkdownPreview: (markdown: string) => Promise<string>;
    }
  
    const ReactMde: React.FC<ReactMdeProps>;
  
    export default ReactMde;
  }
  
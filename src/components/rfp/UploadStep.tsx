import { useCallback, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UploadStepProps {
  onStartAnalysis: (file: { name: string; size: number; type: string }, docType: string) => void;
  // TODO: API 연동 시 아래로 교체
  // onStartAnalysis → POST /api/rfp/upload (multipart/form-data)로 파일 업로드 + 분석 시작
}

export function UploadStep({ onStartAnalysis }: UploadStepProps) {
  const [file, setFile] = useState<{ name: string; size: number; type: string } | null>(null);
  const [docType, setDocType] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f: File) => {
    setFile({ name: f.name, size: f.size, type: f.type });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
          dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input id="file-input" type="file" className="hidden" accept=".pdf,.hwp,.docx" onChange={handleFileInput} />
        {!file ? (
          <>
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium text-foreground mb-1">RFP 문서를 여기에 드래그하거나 클릭하여 업로드</p>
            <p className="text-sm text-muted-foreground">지원 형식: PDF, HWP, DOCX</p>
          </>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <FileText className="w-10 h-10 text-primary" />
            <div className="text-left">
              <p className="font-medium text-foreground">{file.name}</p>
              <p className="text-sm text-muted-foreground">{formatSize(file.size)}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Doc type */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">문서 유형</label>
        <Select value={docType} onValueChange={setDocType}>
          <SelectTrigger>
            <SelectValue placeholder="문서 유형을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="공공 RFP">공공 RFP</SelectItem>
            <SelectItem value="민간 요구사항서">민간 요구사항서</SelectItem>
            <SelectItem value="회의록">회의록</SelectItem>
            <SelectItem value="기타">기타</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        className="w-full"
        size="lg"
        disabled={!file || !docType}
        onClick={() => file && onStartAnalysis(file, docType)}
      >
        분석 시작
      </Button>
    </div>
  );
}
